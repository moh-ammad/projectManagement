import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import axios from 'axios'
import { Users, FolderOpen, Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    activeProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const requests = [
        axios.get('/api/users')
      ];

      // Add different requests based on role
      if (user.role === 'user') {
        requests.push(axios.get('/api/tasks')); // Employees see tasks
      } else {
        requests.push(axios.get('/api/projects')); // Admin/Manager see projects
        requests.push(axios.get('/api/activities?limit=10'));
      }

      const responses = await Promise.all(requests);
      const [employeesRes, dataRes, activitiesRes] = responses;

      const employees = employeesRes.data.users;

      if (user.role === 'user') {
        // For employees, show task statistics
        const tasks = dataRes.data.tasks;
        setStats({
          totalEmployees: employees.length,
          totalProjects: tasks.length, // Show as "My Tasks"
          activeProjects: tasks.filter(t => t.status === 'in-progress').length
        });
        setRecentProjects(tasks.slice(0, 5)); // Show recent tasks
      } else {
        // For admin/manager, show project statistics
        const projects = dataRes.data.projects;
        setStats({
          totalEmployees: employees.length,
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'in-progress').length
        });
        setRecentProjects(projects.slice(0, 5));
      }

      // Set recent activities if available
      if (activitiesRes) {
        setRecentActivities(activitiesRes.data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'in-progress': return 'badge-in-progress';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {user.name}!
        </h1>
        <p className="text-gray-600">
          Welcome to your {user.role} dashboard. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="stats-card bg-gradient-to-br from-primary-500 to-primary-700">
          <div className="text-3xl font-bold mb-2">{stats.totalEmployees}</div>
          <div className="flex items-center text-sm opacity-90">
            <Users size={16} className="mr-2" />
            {user.role === 'admin' ? 'Total Employees' : user.role === 'manager' ? 'My Team' : 'Team Members'}
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-secondary-500 to-secondary-700">
          <div className="text-3xl font-bold mb-2">{stats.totalProjects}</div>
          <div className="flex items-center text-sm opacity-90">
            <FolderOpen size={16} className="mr-2" />
            {user.role === 'user' ? 'My Tasks' : 'Total Projects'}
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-accent-600 to-accent-800">
          <div className="text-3xl font-bold mb-2">{stats.activeProjects}</div>
          <div className="flex items-center text-sm opacity-90">
            <Activity size={16} className="mr-2" />
            Active Projects
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {user.role === 'user' ? 'Recent Tasks' : 'Recent Projects'}
          </h2>
        
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              No {user.role === 'user' ? 'tasks' : 'projects'} found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
                  <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {project.description.length > 80 
                    ? `${project.description.substring(0, 80)}...` 
                    : project.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Assigned to: {project.assignedTo.name}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Activity Log - Only for Admin and Manager */}
        {user.role !== 'user' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Activity
            </h2>
            
            {recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="space-y-4 pr-2">
                  {recentActivities.map((activity) => (
                    <div key={activity._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        {activity.action.includes('user') ? (
                          <Users className="h-5 w-5 text-blue-500" />
                        ) : activity.action.includes('project') ? (
                          <FolderOpen className="h-5 w-5 text-green-500" />
                        ) : (
                          <Activity className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{activity.user?.name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(activity.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard