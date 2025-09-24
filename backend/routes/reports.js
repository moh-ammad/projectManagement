const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports
// @desc    Get comprehensive reports based on role
// @access  Private (Admin, Manager)
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const currentUser = req.user;
    const { startDate, endDate, managerId } = req.query;

    // Date filtering
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let projectQuery = {};
    let taskQuery = {};
    let userQuery = {};

    // Role-based filtering
    if (currentUser.role === 'manager') {
      projectQuery.assignedTo = currentUser._id;
      const managerProjects = await Project.find(projectQuery).select('_id');
      const projectIds = managerProjects.map(p => p._id);
      taskQuery.project = { $in: projectIds };
    } else if (currentUser.role === 'admin' && managerId) {
      projectQuery.assignedTo = managerId;
      const managerProjects = await Project.find(projectQuery).select('_id');
      const projectIds = managerProjects.map(p => p._id);
      taskQuery.project = { $in: projectIds };
    }

    // Add date filtering
    if (Object.keys(dateFilter).length > 0) {
      projectQuery.createdAt = dateFilter;
      taskQuery.createdAt = dateFilter;
    }

    // Get overview statistics
    const [totalProjects, allTasks, activeUsers] = await Promise.all([
      Project.countDocuments(projectQuery),
      Task.find(taskQuery),
      User.countDocuments({ isActive: true, ...userQuery })
    ]);

    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    
    // Calculate average completion time
    const completedTasksWithTime = allTasks.filter(task => 
      task.status === 'completed' && task.createdAt && task.updatedAt
    );
    
    const avgCompletionTime = completedTasksWithTime.length > 0 
      ? Math.round(
          completedTasksWithTime.reduce((acc, task) => {
            const days = (new Date(task.updatedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24);
            return acc + days;
          }, 0) / completedTasksWithTime.length
        )
      : 0;

    // Get project statistics
    const projects = await Project.find(projectQuery)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    const projectStats = await Promise.all(
      projects.map(async (project) => {
        const projectTasks = await Task.find({ project: project._id });
        const completedProjectTasks = projectTasks.filter(task => task.status === 'completed');
        
        return {
          title: project.title,
          managerName: project.assignedTo.name,
          totalTasks: projectTasks.length,
          completedTasks: completedProjectTasks.length,
          progress: projectTasks.length > 0 
            ? Math.round((completedProjectTasks.length / projectTasks.length) * 100)
            : 0,
          status: project.status
        };
      })
    );

    // Get user statistics (Admin only)
    let userStats = [];
    if (currentUser.role === 'admin') {
      const users = await User.find({ 
        isActive: true, 
        role: { $in: ['manager', 'user'] },
        ...userQuery 
      });

      userStats = await Promise.all(
        users.map(async (user) => {
          const userTasks = await Task.find({ assignedTo: user._id, ...taskQuery });
          const completedUserTasks = userTasks.filter(task => task.status === 'completed');
          const inProgressUserTasks = userTasks.filter(task => task.status === 'in-progress');
          
          // Calculate average completion time for this user
          const userCompletedWithTime = completedUserTasks.filter(task => 
            task.createdAt && task.updatedAt
          );
          
          const userAvgTime = userCompletedWithTime.length > 0
            ? Math.round(
                userCompletedWithTime.reduce((acc, task) => {
                  const days = (new Date(task.updatedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24);
                  return acc + days;
                }, 0) / userCompletedWithTime.length
              )
            : 0;

          return {
            name: user.name,
            role: user.role,
            completedTasks: completedUserTasks.length,
            inProgressTasks: inProgressUserTasks.length,
            totalTasks: userTasks.length,
            avgCompletionTime: userAvgTime
          };
        })
      );
    }

    res.json({
      overview: {
        totalProjects,
        completedTasks,
        activeUsers,
        avgCompletionTime
      },
      projectStats,
      userStats
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/export
// @desc    Export reports in CSV/PDF format
// @access  Private (Admin, Manager)
router.get('/export', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, managerId } = req.query;
    
    // Get the same data as the main reports endpoint
    // This is a simplified version - in production, you'd use libraries like
    // csv-writer for CSV or puppeteer/jsPDF for PDF generation
    
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: { startDate, endDate },
      format
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
      
      // Simple CSV generation (in production, use proper CSV library)
      let csvContent = 'Report Generated At,Start Date,End Date\n';
      csvContent += `${reportData.generatedAt},${startDate || 'N/A'},${endDate || 'N/A'}\n`;
      
      res.send(csvContent);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'PDF export not implemented yet', data: reportData });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Export failed' });
  }
});

module.exports = router;