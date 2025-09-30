const express = require('express');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const notificationService = require('../services/notificationService');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { recipient: currentUser._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name email')
      .populate('relatedProject', 'title')
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
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

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: currentUser._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    
    await Notification.updateMany(
      { recipient: currentUser._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: currentUser._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const count = await Notification.countDocuments({
      recipient: currentUser._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications/test-email
// @desc    Test email notification (Admin only)
// @access  Private (Admin)
router.post('/test-email', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const testNotification = {
      recipient: req.user._id,
      type: 'system_update',
      title: 'Test Email Notification',
      message: 'This is a test email to verify the notification system is working correctly.',
      priority: 'medium'
    };

    await notificationService.createNotification(testNotification);
    res.json({ message: 'Test email notification sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

module.exports = router;