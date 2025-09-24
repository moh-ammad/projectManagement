const express = require('express');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// In-memory settings storage (in production, use database)
let systemSettings = {
  projectDefaults: {
    defaultPriority: 'medium',
    defaultStatus: 'pending',
    autoAssignDeadline: false,
    defaultDeadlineDays: 7
  },
  taskDefaults: {
    defaultPriority: 'medium',
    defaultStatus: 'pending',
    requireEstimatedHours: true,
    autoNotifyOnOverdue: true
  },
  systemSettings: {
    allowSelfRegistration: false,
    requireManagerApproval: true,
    maxProjectsPerManager: 10,
    maxTasksPerUser: 20,
    sessionTimeoutMinutes: 480
  },
  notifications: {
    emailNotifications: true,
    taskDeadlineReminder: true,
    projectStatusUpdates: true,
    weeklyReports: true
  }
};

// @route   GET /api/settings
// @desc    Get system settings
// @access  Private (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    res.json({ settings: systemSettings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update system settings
// @access  Private (Admin only)
router.put('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Validate and update settings
    if (settings) {
      systemSettings = { ...systemSettings, ...settings };
    }

    res.json({ 
      message: 'Settings updated successfully',
      settings: systemSettings 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/settings/defaults
// @desc    Get default values for forms
// @access  Private
router.get('/defaults', auth, async (req, res) => {
  try {
    const { type } = req.query; // 'project' or 'task'
    
    if (type === 'project') {
      res.json({
        priority: systemSettings.projectDefaults.defaultPriority,
        status: systemSettings.projectDefaults.defaultStatus,
        autoDeadline: systemSettings.projectDefaults.autoAssignDeadline,
        deadlineDays: systemSettings.projectDefaults.defaultDeadlineDays
      });
    } else if (type === 'task') {
      res.json({
        priority: systemSettings.taskDefaults.defaultPriority,
        status: systemSettings.taskDefaults.defaultStatus,
        requireHours: systemSettings.taskDefaults.requireEstimatedHours
      });
    } else {
      res.json({ settings: systemSettings });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;