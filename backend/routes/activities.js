const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities
// @desc    Get activity logs based on role permissions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { page = 1, limit = 20, target, action } = req.query;
    
    let query = {};

    // Role-based filtering
    if (currentUser.role === 'user') {
      // Users can only see their own activities
      query.user = currentUser._id;
    } else if (currentUser.role === 'manager') {
      // Managers can see activities of users they manage
      const User = require('../models/Employee');
      const managedUsers = await User.find({
        $or: [
          { manager: currentUser._id },
          { createdBy: currentUser._id }
        ]
      }).select('_id');
      
      const userIds = [currentUser._id, ...managedUsers.map(user => user._id)];
      query.user = { $in: userIds };
    }
    // Admin sees all activities (no query filter)

    // Additional filters
    if (target) query.target = target;
    if (action) query.action = action;

    const skip = (page - 1) * limit;
    
    const activities = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      activities,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/stats
// @desc    Get activity statistics
// @access  Private (Admin, Manager)
router.get('/stats', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const currentUser = req.user;
    let matchQuery = {};

    if (currentUser.role === 'manager') {
      const User = require('../models/Employee');
      const managedUsers = await User.find({
        $or: [
          { manager: currentUser._id },
          { createdBy: currentUser._id }
        ]
      }).select('_id');
      
      const userIds = [currentUser._id, ...managedUsers.map(user => user._id)];
      matchQuery.user = { $in: userIds };
    }

    const stats = await ActivityLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentActivities = await ActivityLog.find(matchQuery)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats,
      recentActivities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;