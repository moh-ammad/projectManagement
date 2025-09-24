const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

// Check if user can manage another user (hierarchy check)
const canManageUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.body.userId;
    const currentUser = req.user;

    if (currentUser.role === 'admin') {
      return next(); // Admin can manage anyone
    }

    if (currentUser.role === 'manager') {
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Manager can only manage users they created or users under them
      if (targetUser.createdBy?.toString() === currentUser._id.toString() || 
          targetUser.manager?.toString() === currentUser._id.toString()) {
        return next();
      }
    }

    return res.status(403).json({ 
      message: 'Access denied. Cannot manage this user.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, authorize, canManageUser };