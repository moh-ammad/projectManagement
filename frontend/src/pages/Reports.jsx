import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Clock,
  User,
  Target
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    overview: {},
    projectStats: [],
    userStats: [],
    managerStats: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedManager, setSelectedManager] = useState('');
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchReportData();
    if (user?.role === 'admin') {
      fetchManagers();
    }
  }, [dateRange, selectedManager]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        ...(selectedManager && { managerId: selectedManager })
      });

      const response = await axios.get(`/api/reports?${params}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get('/api/users');
      setManagers(response.data.users.filter(u => u.role === 'manager' && u.isActive));
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const exportReport = async (format = 'csv') => {
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format,
        ...(selectedManager && { managerId: selectedManager })
      });

      const response = await axios.get(`/api/reports/export?${params}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${dateRange.startDate}_${dateRange.endDate}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (user?.role === 'user') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-500">Reports are only available to Admins and Managers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          {user?.role === 'admin' 
            ? 'System-wide reports and performance metrics'
            : 'Team performance and project reports'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {user?.role === 'admin' && (
            <div>
              <label className="form-label">Manager</label>
              <select
                className="form-select"
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
              >
                <option value="">All Managers</option>
                {managers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end space-x-2">
            <button
              onClick={() => exportReport('csv')}
              className="btn btn-secondary flex-1"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="btn btn-secondary flex-1"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stats-card bg-gradient-to-br from-primary-500 to-primary-700">
              <div className="text-3xl font-bold mb-2">{reportData.overview.totalProjects || 0}</div>
              <div className="flex items-center text-sm opacity-90">
                <FolderOpen size={16} className="mr-2" />
                Total Projects
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-secondary-500 to-secondary-700">
              <div className="text-3xl font-bold mb-2">{reportData.overview.completedTasks || 0}</div>
              <div className="flex items-center text-sm opacity-90">
                <CheckSquare size={16} className="mr-2" />
                Completed Tasks
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-accent-600 to-accent-800">
              <div className="text-3xl font-bold mb-2">{reportData.overview.activeUsers || 0}</div>
              <div className="flex items-center text-sm opacity-90">
                <Users size={16} className="mr-2" />
                Active Users
              </div>
            </div>

            <div className="stats-card bg-gradient-to-br from-primary-600 to-secondary-600">
              <div className="text-3xl font-bold mb-2">{reportData.overview.avgCompletionTime || 0}d</div>
              <div className="flex items-center text-sm opacity-90">
                <Clock size={16} className="mr-2" />
                Avg Completion
              </div>
            </div>
          </div>

          {/* Project Performance */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Project Performance
            </h2>
            
            {reportData.projectStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No project data available for the selected period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.projectStats.map((project, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{project.managerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {project.completedTasks}/{project.totalTasks}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge badge-${project.status === 'completed' ? 'completed' : project.status === 'in-progress' ? 'in-progress' : 'pending'}`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Performance */}
          {user?.role === 'admin' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="mr-2" size={20} />
                User Performance
              </h2>
              
              {reportData.userStats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No user performance data available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportData.userStats.map((userStat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{userStat.name}</h3>
                        <span className={`badge badge-${userStat.role}`}>{userStat.role}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span className="font-medium">{userStat.completedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks In Progress:</span>
                          <span className="font-medium">{userStat.inProgressTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Completion:</span>
                          <span className="font-medium">{userStat.avgCompletionTime}d</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;