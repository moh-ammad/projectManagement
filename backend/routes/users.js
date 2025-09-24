const express = require('express');
const User = require('../models/User');
const { auth, authorize, canManageUser } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// @route   POST /api/users
// @desc    Create new user (Admin creates manager/user, Manager creates user)
// @access  Private (Admin, Manager)
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const currentUser = req.user;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Role validation based on current user
    if (currentUser.role === 'manager' && role !== 'user') {
      return res.status(403).json({ message: 'Managers can only create users' });
    }

    if (currentUser.role === 'admin' && !['manager', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'user',
      createdBy: currentUser._id
    };

    // Set manager field based on role and current user
    if (role === 'user') {
      if (currentUser.role === 'manager') {
        userData.manager = currentUser._id;
      } else if (currentUser.role === 'admin') {
        // Admin can optionally specify a manager, or leave it empty
        // Manager can be assigned later
      }
    }

    const user = new User(userData);
    await user.save();

    // Log activity
    await logActivity(
      currentUser._id,
      'user_created',
      'user',
      user._id,
      `${currentUser.role} ${currentUser.name} created user ${user.name} with role ${user.role}`,
      { targetRole: user.role, createdByRole: currentUser.role },
      req
    );

    // Return user without password
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('manager', 'name email');

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get users based on role permissions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    let query = {};

    if (currentUser.role === 'manager') {
      // Manager sees users they created or manage
      query = {
        $or: [
          { createdBy: currentUser._id },
          { manager: currentUser._id }
        ]
      };
    } else if (currentUser.role === 'user') {
      // Users can only see themselves
      query = { _id: currentUser._id };
    }
    // Admin sees all users (no query filter)

    const users = await User.find(query)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('manager', 'name email')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', auth, canManageUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('manager', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, canManageUser, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const currentUser = req.user;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role validation
    if (role && currentUser.role === 'manager' && role !== 'user') {
      return res.status(403).json({ message: 'Managers can only manage users' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && currentUser.role === 'admin') user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Log activity
    await logActivity(
      currentUser._id,
      'user_updated',
      'user',
      user._id,
      `${currentUser.role} ${currentUser.name} updated user ${user.name}`,
      { updatedFields: Object.keys(req.body) },
      req
    );

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('manager', 'name email');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/password
// @desc    Change user password
// @access  Private (Self only)
router.put('/:id/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const currentUser = req.user;

    // Users can only change their own password
    if (req.params.id !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log activity
    await logActivity(
      user._id,
      'user_updated',
      'user',
      user._id,
      `User ${user.name} changed their password`,
      { action: 'password_change' },
      req
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete by setting isActive to false)
// @access  Private
router.delete('/:id', auth, canManageUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    // Log activity
    await logActivity(
      req.user._id,
      'user_deleted',
      'user',
      user._id,
      `${req.user.role} ${req.user.name} deactivated user ${user.name}`,
      {},
      req
    );

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;