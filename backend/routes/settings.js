const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Settings = require('../models/Settings');
const { logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// @route   GET /api/settings
// @desc    Get system settings
// @access  Private (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ settings });
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
    const currentUser = req.user;
    
    // Update settings in database
    const updatedSettings = await Settings.updateSettings(settings, currentUser._id);

    // Log activity
    await logActivity(
      currentUser._id,
      'settings_updated',
      'settings',
      updatedSettings._id,
      `Admin ${currentUser.name} updated system settings`,
      { updatedFields: Object.keys(settings) },
      req
    );

    res.json({ 
      message: 'Settings updated successfully',
      settings: updatedSettings 
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
    const settings = await Settings.getSettings();
    
    if (type === 'project') {
      res.json({
        priority: settings.projectDefaults.defaultPriority,
        status: settings.projectDefaults.defaultStatus,
        autoDeadline: settings.projectDefaults.autoAssignDeadline,
        deadlineDays: settings.projectDefaults.defaultDeadlineDays
      });
    } else if (type === 'task') {
      res.json({
        priority: settings.taskDefaults.defaultPriority,
        status: settings.taskDefaults.defaultStatus,
        requireHours: settings.taskDefaults.requireEstimatedHours
      });
    } else {
      res.json({ settings });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;