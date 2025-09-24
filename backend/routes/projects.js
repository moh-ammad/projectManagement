const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// @route   POST /api/projects
// @desc    Create new project (Only Admin can create projects and assign to Managers)
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { title, description, assignedTo, endDate, priority } = req.body;
    const currentUser = req.user;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if assigned user exists and is a manager
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !assignedUser.isActive) {
      return res.status(400).json({ message: 'Invalid user assignment' });
    }

    if (assignedUser.role !== 'manager') {
      return res.status(400).json({ message: 'Projects can only be assigned to Managers' });
    }

    // Admin can assign to any manager, Manager cannot create projects (only tasks)
    if (currentUser.role === 'manager') {
      return res.status(403).json({ message: 'Managers cannot create projects. Please contact Admin.' });
    }

    const project = new Project({
      title,
      description,
      assignedTo,
      createdBy: currentUser._id,
      endDate,
      priority
    });

    await project.save();

    // Log activity
    await logActivity(
      currentUser._id,
      'project_created',
      'project',
      project._id,
      `${currentUser.role} ${currentUser.name} created project "${title}" assigned to ${assignedUser.name}`,
      { assignedTo: assignedUser.name, priority },
      req
    );

    const populatedProject = await Project.findById(project._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project: populatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects
// @desc    Get projects based on role permissions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    let query = {};

    if (currentUser.role === 'user') {
      // Users don't see projects directly, they see tasks
      return res.json({ projects: [], message: 'Users should access tasks, not projects directly' });
    } else if (currentUser.role === 'manager') {
      // Managers see only projects assigned to them
      query = { assignedTo: currentUser._id };
    }
    // Admin sees all projects (no query filter)

    const projects = await Project.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const project = await Project.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    let hasAccess = false;

    if (currentUser.role === 'admin') {
      hasAccess = true;
    } else if (currentUser.role === 'manager') {
      // Manager can see projects assigned to them
      hasAccess = project.assignedTo._id.toString() === currentUser._id.toString();
    } else if (currentUser.role === 'user') {
      // Users don't access projects directly
      return res.status(403).json({ message: 'Users should access tasks, not projects directly' });
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { title, description, status, endDate, priority, assignedTo } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    let canUpdate = false;

    if (currentUser.role === 'admin') {
      canUpdate = true;
    } else if (currentUser.role === 'manager') {
      // Manager can update projects assigned to them
      canUpdate = project.assignedTo.toString() === currentUser._id.toString();
    } else if (currentUser.role === 'user') {
      // Users don't update projects directly
      return res.status(403).json({ message: 'Users should update tasks, not projects directly' });
    }

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (endDate) project.endDate = endDate;
    if (priority) project.priority = priority;
    
    // Only admin can reassign projects, and only to managers
    if (assignedTo && currentUser.role === 'admin') {
      const newAssignedUser = await User.findById(assignedTo);
      if (!newAssignedUser || !newAssignedUser.isActive) {
        return res.status(400).json({ message: 'Invalid user assignment' });
      }
      if (newAssignedUser.role !== 'manager') {
        return res.status(400).json({ message: 'Projects can only be assigned to Managers' });
      }
      project.assignedTo = assignedTo;
    }

    const oldStatus = project.status;
    await project.save();

    // Log activity
    const activityDescription = status && status !== oldStatus
      ? `${currentUser.role} ${currentUser.name} changed project "${project.title}" status from ${oldStatus} to ${status}`
      : `${currentUser.role} ${currentUser.name} updated project "${project.title}"`;

    await logActivity(
      currentUser._id,
      status && status !== oldStatus ? 'project_status_changed' : 'project_updated',
      'project',
      project._id,
      activityDescription,
      { oldStatus, newStatus: status, updatedBy: currentUser.role },
      req
    );

    const updatedProject = await Project.findById(project._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (Admin can delete any, Manager can delete their own)
// @access  Private (Admin, Manager)
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const currentUser = req.user;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Manager can only delete projects assigned to them
    if (currentUser.role === 'manager') {
      const canDelete = project.assignedTo.toString() === currentUser._id.toString();
      
      if (!canDelete) {
        return res.status(403).json({ message: 'Cannot delete this project' });
      }
    }

    // Log activity before deletion
    await logActivity(
      currentUser._id,
      'project_deleted',
      'project',
      project._id,
      `${currentUser.role} ${currentUser.name} deleted project "${project.title}"`,
      { assignedTo: project.assignedTo },
      req
    );

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;