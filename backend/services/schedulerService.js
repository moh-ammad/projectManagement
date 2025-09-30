const cron = require('node-cron');
const notificationService = require('./notificationService');
const Settings = require('../models/Settings');

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.isInitialized = false;
  }

  // Initialize the scheduler with default jobs
  async init() {
    if (this.isInitialized) return;

    console.log('🕐 Initializing notification scheduler...');

    // Schedule deadline reminders - runs every hour during business hours
    this.scheduleDeadlineReminders();
    
    // Schedule weekly reports - runs daily to check if it's time
    this.scheduleWeeklyReports();
    
    // Schedule overdue task notifications - runs every 6 hours
    this.scheduleOverdueNotifications();

    this.isInitialized = true;
    console.log('✅ Notification scheduler initialized');
  }

  // Schedule deadline reminders
  scheduleDeadlineReminders() {
    // Run every hour from 8 AM to 6 PM
    const job = cron.schedule('0 8-18 * * *', async () => {
      try {
        console.log('📅 Running deadline reminder check...');
        await notificationService.scheduleDeadlineReminders();
      } catch (error) {
        console.error('Error in deadline reminder job:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    job.start();
    this.jobs.set('deadline-reminders', job);
    console.log('📅 Deadline reminder job scheduled (hourly 8AM-6PM)');
  }

  // Schedule weekly reports
  scheduleWeeklyReports() {
    // Run every day at 9 AM to check if weekly reports should be sent
    const job = cron.schedule('0 9 * * *', async () => {
      try {
        const settings = await Settings.getSettings();
        const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
        
        if (settings.notifications?.weeklyReports && 
            today === (settings.notifications?.weeklyReportDay || 'friday')) {
          console.log('📊 Generating weekly reports...');
          await notificationService.generateWeeklyReports();
        }
      } catch (error) {
        console.error('Error in weekly report job:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    job.start();
    this.jobs.set('weekly-reports', job);
    console.log('📊 Weekly report job scheduled (daily check at 9AM)');
  }

  // Schedule overdue task notifications
  scheduleOverdueNotifications() {
    // Run every 6 hours
    const job = cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('⚠️ Checking for overdue tasks...');
        await this.sendOverdueNotifications();
      } catch (error) {
        console.error('Error in overdue notification job:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    job.start();
    this.jobs.set('overdue-notifications', job);
    console.log('⚠️ Overdue notification job scheduled (every 6 hours)');
  }

  // Send notifications for overdue tasks
  async sendOverdueNotifications() {
    try {
      const Task = require('../models/Task');
      const settings = await Settings.getSettings();
      
      if (!settings.notifications?.overdueTasks) return;

      // Find overdue tasks
      const overdueTasks = await Task.find({
        endDate: { $lt: new Date() },
        status: { $ne: 'completed' }
      }).populate('assignedTo project');

      for (const task of overdueTasks) {
        if (task.assignedTo) {
          // Check if overdue notification was already sent today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const Notification = require('../models/Notification');
          const existingNotification = await Notification.findOne({
            recipient: task.assignedTo._id,
            type: 'task_overdue',
            relatedTask: task._id,
            createdAt: { $gte: today }
          });

          if (!existingNotification) {
            await notificationService.createNotification({
              recipient: task.assignedTo._id,
              type: 'task_overdue',
              title: `Overdue Task: ${task.title}`,
              message: `Your task "${task.title}" was due on ${task.endDate.toLocaleDateString()}. Please update the status or deadline. Project: ${task.project?.title || 'Unknown'}`,
              relatedTask: task._id,
              relatedProject: task.project?._id,
              priority: 'urgent'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
    }
  }

  // Stop all scheduled jobs
  stopAll() {
    console.log('🛑 Stopping all scheduled jobs...');
    for (const [name, job] of this.jobs.entries()) {
      job.stop();
      console.log(`⏹️ Stopped job: ${name}`);
    }
    this.jobs.clear();
    this.isInitialized = false;
  }

  // Get status of all jobs
  getStatus() {
    const status = {};
    for (const [name, job] of this.jobs.entries()) {
      status[name] = {
        running: job.running,
        scheduled: job.scheduled
      };
    }
    return status;
  }

  // Manually trigger a specific job (for testing)
  async trigger(jobName) {
    switch (jobName) {
      case 'deadline-reminders':
        await notificationService.scheduleDeadlineReminders();
        break;
      case 'weekly-reports':
        await notificationService.generateWeeklyReports();
        break;
      case 'overdue-notifications':
        await this.sendOverdueNotifications();
        break;
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
  }
}

module.exports = new SchedulerService();