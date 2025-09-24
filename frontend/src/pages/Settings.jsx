import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    projectDefaults: {
      defaultPriority: 'medium',
      defaultStatus: 'pending',
      autoAssignDeadline: false,
      defaultDeadlineDays: 7
    },
    taskDefaults: {
      defaultPriority: 'medium',
      defaultStatus: 'pending',
      requireEstimatedHours: true,
      autoNotifyOnOverdue: true
    },
    systemSettings: {
      allowSelfRegistration: false,
      requireManagerApproval: true,
      maxProjectsPerManager: 10,
      maxTasksPerUser: 20,
      sessionTimeoutMinutes: 480
    },
    notifications: {
      emailNotifications: true,
      taskDeadlineReminder: true,
      projectStatusUpdates: true,
      weeklyReports: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data.settings || settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put('/api/settings', { settings });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        projectDefaults: {
          defaultPriority: 'medium',
          defaultStatus: 'pending',
          autoAssignDeadline: false,
          defaultDeadlineDays: 7
        },
        taskDefaults: {
          defaultPriority: 'medium',
          defaultStatus: 'pending',
          requireEstimatedHours: true,
          autoNotifyOnOverdue: true
        },
        systemSettings: {
          allowSelfRegistration: false,
          requireManagerApproval: true,
          maxProjectsPerManager: 10,
          maxTasksPerUser: 20,
          sessionTimeoutMinutes: 480
        },
        notifications: {
          emailNotifications: true,
          taskDeadlineReminder: true,
          projectStatusUpdates: true,
          weeklyReports: true
        }
      });
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-500">System settings are only available to Administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system defaults and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Project Defaults */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SettingsIcon className="mr-2" size={20} />
            Project Defaults
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Default Priority</label>
              <select
                className="form-select"
                value={settings.projectDefaults.defaultPriority}
                onChange={(e) => updateSetting('projectDefaults', 'defaultPriority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="form-label">Default Status</label>
              <select
                className="form-select"
                value={settings.projectDefaults.defaultStatus}
                onChange={(e) => updateSetting('projectDefaults', 'defaultStatus', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoAssignDeadline"
                className="mr-2"
                checked={settings.projectDefaults.autoAssignDeadline}
                onChange={(e) => updateSetting('projectDefaults', 'autoAssignDeadline', e.target.checked)}
              />
              <label htmlFor="autoAssignDeadline" className="text-sm text-gray-700">
                Auto-assign deadline to new projects
              </label>
            </div>

            <div>
              <label className="form-label">Default Deadline (Days)</label>
              <input
                type="number"
                className="form-input"
                value={settings.projectDefaults.defaultDeadlineDays}
                onChange={(e) => updateSetting('projectDefaults', 'defaultDeadlineDays', parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>
          </div>
        </div>

        {/* Task Defaults */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Task Defaults
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Default Priority</label>
              <select
                className="form-select"
                value={settings.taskDefaults.defaultPriority}
                onChange={(e) => updateSetting('taskDefaults', 'defaultPriority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="form-label">Default Status</label>
              <select
                className="form-select"
                value={settings.taskDefaults.defaultStatus}
                onChange={(e) => updateSetting('taskDefaults', 'defaultStatus', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireEstimatedHours"
                className="mr-2"
                checked={settings.taskDefaults.requireEstimatedHours}
                onChange={(e) => updateSetting('taskDefaults', 'requireEstimatedHours', e.target.checked)}
              />
              <label htmlFor="requireEstimatedHours" className="text-sm text-gray-700">
                Require estimated hours for new tasks
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoNotifyOnOverdue"
                className="mr-2"
                checked={settings.taskDefaults.autoNotifyOnOverdue}
                onChange={(e) => updateSetting('taskDefaults', 'autoNotifyOnOverdue', e.target.checked)}
              />
              <label htmlFor="autoNotifyOnOverdue" className="text-sm text-gray-700">
                Auto-notify on overdue tasks
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="mr-2" size={20} />
            System Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowSelfRegistration"
                className="mr-2"
                checked={settings.systemSettings.allowSelfRegistration}
                onChange={(e) => updateSetting('systemSettings', 'allowSelfRegistration', e.target.checked)}
              />
              <label htmlFor="allowSelfRegistration" className="text-sm text-gray-700">
                Allow self-registration
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireManagerApproval"
                className="mr-2"
                checked={settings.systemSettings.requireManagerApproval}
                onChange={(e) => updateSetting('systemSettings', 'requireManagerApproval', e.target.checked)}
              />
              <label htmlFor="requireManagerApproval" className="text-sm text-gray-700">
                Require manager approval for new users
              </label>
            </div>

            <div>
              <label className="form-label">Max Projects per Manager</label>
              <input
                type="number"
                className="form-input"
                value={settings.systemSettings.maxProjectsPerManager}
                onChange={(e) => updateSetting('systemSettings', 'maxProjectsPerManager', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="form-label">Max Tasks per User</label>
              <input
                type="number"
                className="form-input"
                value={settings.systemSettings.maxTasksPerUser}
                onChange={(e) => updateSetting('systemSettings', 'maxTasksPerUser', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="form-label">Session Timeout (Minutes)</label>
              <input
                type="number"
                className="form-input"
                value={settings.systemSettings.sessionTimeoutMinutes}
                onChange={(e) => updateSetting('systemSettings', 'sessionTimeoutMinutes', parseInt(e.target.value))}
                min="30"
                max="1440"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Notification Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                className="mr-2"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="taskDeadlineReminder"
                className="mr-2"
                checked={settings.notifications.taskDeadlineReminder}
                onChange={(e) => updateSetting('notifications', 'taskDeadlineReminder', e.target.checked)}
              />
              <label htmlFor="taskDeadlineReminder" className="text-sm text-gray-700">
                Task deadline reminders
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="projectStatusUpdates"
                className="mr-2"
                checked={settings.notifications.projectStatusUpdates}
                onChange={(e) => updateSetting('notifications', 'projectStatusUpdates', e.target.checked)}
              />
              <label htmlFor="projectStatusUpdates" className="text-sm text-gray-700">
                Project status update notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyReports"
                className="mr-2"
                checked={settings.notifications.weeklyReports}
                onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
              />
              <label htmlFor="weeklyReports" className="text-sm text-gray-700">
                Weekly progress reports
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={handleReset}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw size={16} />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={16} />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;