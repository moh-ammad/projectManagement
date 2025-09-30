const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create new task (Only Managers can create tasks for their projects)
// @access  Private (Manager)
router.post('/', auth, authorize('manager'), async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, priority, estimatedHours } = req.body;
    const currentUser = req.user;

    if (!title || !description || !projectId || !assignedTo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if project exists and is assigned to current manager
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.assignedTo.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'You can only create tasks for your assigned projects' });
    }

    // Check if assigned user exists and is under this manager
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !assignedUser.isActive) {
      return res.status(400).json({ message: 'Invalid user assignment' });
    }

    if (assignedUser.role !== 'user') {
      return res.status(400).json({ message: 'Tasks can only be assigned to Users' });
    }

    // Check if user is under this manager
    const isUnderManager = assignedUser.manager?.toString() === currentUser._id.toString() ||
                          assignedUser.createdBy?.toString() === currentUser._id.toString();
    
    if (!isUnderManager) {
      return res.status(403).json({ message: 'You can only assign tasks to users in your team' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      assignedBy: currentUser._id,
      dueDate,
      priority,
      estimatedHours
    });

    await task.save();

    // Log activity
    await logActivity(
      currentUser._id,
      'task_created',
      'task',
      task._id,
      `Manager ${currentUser.name} created task "${title}" for ${assignedUser.name}`,
      { projectTitle: project.title, assignedTo: assignedUser.name },
      req
    );

    // Create notification for assigned user
    const notificationService = require('../services/notificationService');
    await notificationService.createNotification({
      recipient: assignedTo,
      sender: currentUser._id,
      type: 'task_assignment',
      title: `New Task Assignment: ${title}`,
      message: `You have been assigned a new task "${title}" in project "${project.title}". Due date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'Not specified'}`,
      relatedTask: task._id,
      relatedProject: projectId,
      priority: priority === 'high' ? 'high' : 'medium'
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'title');

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks
// @desc    Get tasks based on role permissions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    let query = {};

    if (currentUser.role === 'user') {
      // Users see only their assigned tasks
      query = { assignedTo: currentUser._id };
    } else if (currentUser.role === 'manager') {
      // Managers see tasks for projects assigned to them
      const managerProjects = await Project.find({ assignedTo: currentUser._id }).select('_id');
      const projectIds = managerProjects.map(p => p._id);
      query = { project: { $in: projectIds } };
    }
    // Admin sees all tasks (no query filter)

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'title description')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Get tasks for a specific project
// @access  Private (Manager of the project)
router.get('/project/:projectId', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const currentUser = req.user;
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (currentUser.role === 'manager' && project.assignedTo.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { status, actualHours, priority, dueDate, title, description } = req.body;

    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    let canUpdate = false;
    let allowedFields = [];

    if (currentUser.role === 'admin') {
      canUpdate = true;
      allowedFields = ['status', 'actualHours', 'priority', 'dueDate', 'title', 'description'];
    } else if (currentUser.role === 'manager') {
      // Manager can update tasks in their projects
      const project = await Project.findById(task.project._id);
      canUpdate = project.assignedTo.toString() === currentUser._id.toString();
      allowedFields = ['status', 'priority', 'dueDate', 'title', 'description'];
    } else if (currentUser.role === 'user') {
      // Users can only update their own tasks (status and hours)
      canUpdate = task.assignedTo.toString() === currentUser._id.toString();
      allowedFields = ['status', 'actualHours'];
    }

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update allowed fields only
    const oldStatus = task.status;
    if (allowedFields.includes('status') && status) task.status = status;
    if (allowedFields.includes('actualHours') && actualHours !== undefined) task.actualHours = actualHours;
    if (allowedFields.includes('priority') && priority) task.priority = priority;
    if (allowedFields.includes('dueDate') && dueDate) task.dueDate = dueDate;
    if (allowedFields.includes('title') && title) task.title = title;
    if (allowedFields.includes('description') && description) task.description = description;

    await task.save();

    // Log activity
    const activityDescription = status && status !== oldStatus
      ? `${currentUser.role} ${currentUser.name} changed task "${task.title}" status from ${oldStatus} to ${status}`
      : `${currentUser.role} ${currentUser.name} updated task "${task.title}"`;

    await logActivity(
      currentUser._id,
      status && status !== oldStatus ? 'task_status_changed' : 'task_updated',
      'task',
      task._id,
      activityDescription,
      { oldStatus, newStatus: status, updatedBy: currentUser.role },
      req
    );

    // Create notifications for status changes
    if (status && status !== oldStatus) {
      const notificationService = require('../services/notificationService');
      
      // Notify task assignee if status was changed by someone else
      if (task.assignedTo.toString() !== currentUser._id.toString()) {
        await notificationService.createNotification({
          recipient: task.assignedTo,
          sender: currentUser._id,
          type: 'task_completion',
          title: `Task Status Updated: ${task.title}`,
          message: `Your task "${task.title}" status has been changed from "${oldStatus}" to "${status}" by ${currentUser.name}.`,
          relatedTask: task._id,
          relatedProject: task.project._id,
          priority: 'medium'
        });
      }

      // Notify manager when task is completed by employee
      if (status === 'completed' && currentUser.role === 'user') {
        const project = await Project.findById(task.project._id);
        if (project && project.assignedTo.toString() !== currentUser._id.toString()) {
          await notificationService.createNotification({
            recipient: project.assignedTo,
            sender: currentUser._id,
            type: 'task_completion',
            title: `Task Completed: ${task.title}`,
            message: `${currentUser.name} has completed the task "${task.title}" in project "${task.project.title}".`,
            relatedTask: task._id,
            relatedProject: task.project._id,
            priority: 'medium'
          });
        }
      }
    }

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'title');

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin, Manager who owns the project)
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const currentUser = req.user;
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Manager can only delete tasks from their projects
    if (currentUser.role === 'manager') {
      const project = await Project.findById(task.project._id);
      const canDelete = project.assignedTo.toString() === currentUser._id.toString();
      
      if (!canDelete) {
        return res.status(403).json({ message: 'Cannot delete this task' });
      }
    }

    // Log activity before deletion
    await logActivity(
      currentUser._id,
      'task_deleted',
      'task',
      task._id,
      `${currentUser.role} ${currentUser.name} deleted task "${task.title}"`,
      { projectTitle: task.project.title },
      req
    );

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;