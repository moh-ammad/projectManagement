const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_created',
      'user_updated',
      'user_deleted',
      'project_created',
      'project_updated',
      'project_deleted',
      'project_status_changed',
      'task_created',
      'task_updated',
      'task_deleted',
      'task_status_changed',
      'login',
      'logout'
    ]
  },
  target: {
    type: String, // 'user', 'project', 'task', 'system'
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['User', 'Project', 'Task']
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Additional data like old/new values
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for better query performance
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ target: 1, targetId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);