const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Project defaults
  projectDefaults: {
    defaultPriority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    defaultStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    autoAssignDeadline: {
      type: Boolean,
      default: false
    },
    defaultDeadlineDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 365
    }
  },
  
  // Task defaults
  taskDefaults: {
    defaultPriority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    defaultStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    requireEstimatedHours: {
      type: Boolean,
      default: true
    },
    autoNotifyOnOverdue: {
      type: Boolean,
      default: true
    }
  },
  
  // System settings
  systemSettings: {
    allowSelfRegistration: {
      type: Boolean,
      default: false
    },
    requireManagerApproval: {
      type: Boolean,
      default: true
    },
    maxProjectsPerManager: {
      type: Number,
      default: 10,
      min: 1,
      max: 100
    },
    maxTasksPerUser: {
      type: Number,
      default: 20,
      min: 1,
      max: 100
    },
    sessionTimeoutMinutes: {
      type: Number,
      default: 480,
      min: 30,
      max: 1440
    }
  },
  
  // Notification settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    taskDeadlineReminder: {
      type: Boolean,
      default: true
    },
    deadlineReminderDays: {
      type: Number,
      default: 2,
      min: 1,
      max: 7
    },
    reminderTime: {
      type: String,
      default: '09:00'
    },
    projectStatusUpdates: {
      type: Boolean,
      default: true
    },
    statusChangeNotification: {
      type: Boolean,
      default: true
    },
    newProjectAssignment: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: true
    },
    weeklyReportDay: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      default: 'friday'
    },
    weeklyReportTime: {
      type: String,
      default: '09:00'
    },
    overdueTasks: {
      type: Boolean,
      default: true
    },
    teamUpdates: {
      type: Boolean,
      default: true
    },
    systemUpdates: {
      type: Boolean,
      default: true
    }
  },
  
  // Email configuration
  emailConfig: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: {
      type: String,
      default: 'Digital Bevy Project Management'
    }
  },
  
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updates, userId) {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this(updates);
  } else {
    Object.assign(settings, updates);
  }
  settings.lastUpdatedBy = userId;
  return await settings.save();
};

module.exports = mongoose.model('Settings', settingsSchema);