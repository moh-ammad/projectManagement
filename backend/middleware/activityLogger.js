const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, target, targetId, description, metadata = {}, req = null) => {
  try {
    const logData = {
      user: user._id || user,
      action,
      target,
      description,
      metadata
    };

    if (targetId) {
      logData.targetId = targetId;
      logData.targetModel = target === 'user' ? 'User' : 'Project';
    }

    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress;
      logData.userAgent = req.get('User-Agent');
    }

    await ActivityLog.create(logData);
  } catch (error) {
    console.error('Activity logging error:', error);
    // Don't throw error to avoid breaking main functionality
  }
};

module.exports = { logActivity };