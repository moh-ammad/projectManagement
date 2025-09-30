const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/Employee');
const Project = require('../models/Project');
const Task = require('../models/Task');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Create a notification
  async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      
      // If email notifications are enabled for the user, send email
      const recipient = await User.findById(data.recipient);
      if (recipient && await this.shouldSendEmail(recipient, data.type)) {
        await this.sendEmail(notification);
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Check if email should be sent based on user preferences
  async shouldSendEmail(user, notificationType) {
    try {
      // Get user's notification settings from system settings
      const Settings = require('../models/Settings');
      const settings = await Settings.findOne() || {};
      const notifications = settings.notifications || {};

      // Check master email toggle
      if (!notifications.emailNotifications) return false;

      // Check specific notification type settings
      switch (notificationType) {
        case 'task_deadline_reminder':
          return notifications.taskDeadlineReminder !== false;
        case 'task_overdue':
          return notifications.overdueTasks !== false;
        case 'project_status_change':
        case 'project_assignment':
          return notifications.projectStatusUpdates !== false;
        case 'weekly_report':
          return notifications.weeklyReports !== false;
        case 'task_completion':
          return notifications.teamUpdates !== false && user.role === 'manager';
        case 'system_update':
          return notifications.systemUpdates !== false;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking email settings:', error);
      return false;
    }
  }

  // Send email notification
  async sendEmail(notification) {
    try {
      const recipient = await User.findById(notification.recipient);
      if (!recipient || !recipient.email) return false;

      const emailTemplate = this.getEmailTemplate(notification);
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@digitalbevy.com',
        to: recipient.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      };

      await this.transporter.sendMail(mailOptions);
      
      // Update notification as sent
      notification.emailSent = true;
      notification.emailSentAt = new Date();
      await notification.save();

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Get email template based on notification type
  getEmailTemplate(notification) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const templates = {
      task_deadline_reminder: {
        subject: `Task Deadline Reminder - ${notification.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Task Deadline Reminder</h2>
            <p>Hi there,</p>
            <p>This is a reminder that your task is approaching its deadline:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">${notification.title}</h3>
              <p style="margin: 0; color: #6b7280;">${notification.message}</p>
            </div>
            <p>Please make sure to complete this task on time.</p>
            <a href="${baseUrl}/tasks" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Tasks</a>
            <p style="color: #6b7280; font-size: 12px;">Best regards,<br>Digital Bevy Team</p>
          </div>
        `
      },
      project_status_change: {
        subject: `Project Status Update - ${notification.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Project Status Update</h2>
            <p>Hi there,</p>
            <p>A project you're involved with has been updated:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">${notification.title}</h3>
              <p style="margin: 0; color: #6b7280;">${notification.message}</p>
            </div>
            <a href="${baseUrl}/projects" style="display: inline-block; background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Projects</a>
            <p style="color: #6b7280; font-size: 12px;">Best regards,<br>Digital Bevy Team</p>
          </div>
        `
      },
      weekly_report: {
        subject: `Weekly Progress Report - ${new Date().toLocaleDateString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Weekly Progress Report</h2>
            <p>Hi there,</p>
            <p>Here's your weekly progress summary:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">${notification.title}</h3>
              <div style="color: #6b7280;">${notification.message}</div>
            </div>
            <a href="${baseUrl}/dashboard" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Dashboard</a>
            <p style="color: #6b7280; font-size: 12px;">Best regards,<br>Digital Bevy Team</p>
          </div>
        `
      }
    };

    return templates[notification.type] || {
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${notification.title}</h2>
          <p>${notification.message}</p>
          <p style="color: #6b7280; font-size: 12px;">Best regards,<br>Digital Bevy Team</p>
        </div>
      `
    };
  }

  // Schedule task deadline reminders
  async scheduleDeadlineReminders() {
    try {
      const Settings = require('../models/Settings');
      const settings = await Settings.findOne() || {};
      const notifications = settings.notifications || {};

      if (!notifications.taskDeadlineReminder) return;

      const reminderDays = notifications.deadlineReminderDays || 2;
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + reminderDays);
      
      // Find tasks due soon that haven't been reminded about
      const tasks = await Task.find({
        endDate: {
          $lte: reminderDate,
          $gte: new Date()
        },
        status: { $ne: 'completed' }
      }).populate('assignedTo project');

      for (const task of tasks) {
        if (task.assignedTo) {
          // Check if reminder already sent
          const existingReminder = await Notification.findOne({
            recipient: task.assignedTo._id,
            type: 'task_deadline_reminder',
            relatedTask: task._id,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
          });

          if (!existingReminder) {
            await this.createNotification({
              recipient: task.assignedTo._id,
              type: 'task_deadline_reminder',
              title: `Deadline Reminder: ${task.title}`,
              message: `Your task "${task.title}" is due on ${task.endDate.toLocaleDateString()}. Project: ${task.project?.title || 'Unknown'}`,
              relatedTask: task._id,
              relatedProject: task.project?._id,
              priority: 'high'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error scheduling deadline reminders:', error);
    }
  }

  // Generate and send weekly reports
  async generateWeeklyReports() {
    try {
      const Settings = require('../models/Settings');
      const settings = await Settings.findOne() || {};
      const notifications = settings.notifications || {};

      if (!notifications.weeklyReports) return;

      const users = await User.find({ isActive: true, role: { $in: ['user', 'manager'] } });
      
      for (const user of users) {
        const weeklyData = await this.getWeeklyProgressData(user._id);
        
        await this.createNotification({
          recipient: user._id,
          type: 'weekly_report',
          title: 'Weekly Progress Report',
          message: this.formatWeeklyReportMessage(weeklyData),
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Error generating weekly reports:', error);
    }
  }

  // Get weekly progress data for a user
  async getWeeklyProgressData(userId) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [completedTasks, totalTasks, activeProjects] = await Promise.all([
      Task.countDocuments({
        assignedTo: userId,
        status: 'completed',
        updatedAt: { $gte: weekAgo }
      }),
      Task.countDocuments({
        assignedTo: userId,
        createdAt: { $lte: new Date() }
      }),
      Project.countDocuments({
        $or: [
          { assignedTo: userId },
          { 'tasks.assignedTo': userId }
        ],
        status: 'in-progress'
      })
    ]);

    return {
      completedTasks,
      totalTasks,
      activeProjects,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }

  // Format weekly report message
  formatWeeklyReportMessage(data) {
    return `
      <h4>This Week's Summary:</h4>
      <ul>
        <li><strong>${data.completedTasks}</strong> tasks completed</li>
        <li><strong>${data.activeProjects}</strong> active projects</li>
        <li><strong>${data.completionRate}%</strong> overall completion rate</li>
      </ul>
      <p>Keep up the great work!</p>
    `;
  }
}

module.exports = new NotificationService();