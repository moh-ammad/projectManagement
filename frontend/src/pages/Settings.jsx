import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Shield, AlertTriangle,
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
      deadlineReminderDays: 2,
      reminderTime: '09:00',
      projectStatusUpdates: true,
      statusChangeNotification: true,
      newProjectAssignment: true,
      weeklyReports: true,
      weeklyReportDay: 'friday',
      weeklyReportTime: '09:00',
      overdueTasks: true,
      teamUpdates: true,
      systemUpdates: true
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
          deadlineReminderDays: 2,
          reminderTime: '09:00',
          projectStatusUpdates: true,
          statusChangeNotification: true,
          newProjectAssignment: true,
          weeklyReports: true,
          weeklyReportDay: 'friday',
          weeklyReportTime: '09:00',
          overdueTasks: true,
          teamUpdates: true,
          systemUpdates: true
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
        
        {/* Email Setup Guide */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Email Notifications Ready</h3>
              <div className="mt-1 text-sm text-green-700">
                <p>Email notifications are configured! Make sure to:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Enable "Email Notifications" toggle in the Notification Settings section below</li>
                  <li>Configure your preferred reminder times and notification types</li>
                  <li>Update your email address in your <a href="/profile" className="font-semibold underline">Profile</a> if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
          
          <div className="space-y-6">
            {/* Master Email Toggle */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="mr-3"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                />
                <label htmlFor="emailNotifications" className="text-base font-medium text-blue-900">
                  Enable Email Notifications
                </label>
              </div>
              <p className="text-sm text-blue-700 mt-2 ml-6">
                Master switch for all email notifications. When disabled, no emails will be sent.
              </p>
            </div>

            {/* Individual Notification Settings */}
            <div className={`space-y-4 ${!settings.notifications.emailNotifications ? 'opacity-50 pointer-events-none' : ''}`}>
              
              {/* Task Deadline Reminders */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="taskDeadlineReminder"
                      className="mr-3"
                      checked={settings.notifications.taskDeadlineReminder}
                      onChange={(e) => updateSetting('notifications', 'taskDeadlineReminder', e.target.checked)}
                    />
                    <label htmlFor="taskDeadlineReminder" className="text-sm font-medium text-gray-900">
                      Task Deadline Reminders
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-600 ml-6 mb-3">
                  Send email reminders for upcoming task deadlines
                </p>
                <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Remind me</label>
                    <select
                      className="form-select text-xs"
                      value={settings.notifications.deadlineReminderDays || 2}
                      onChange={(e) => updateSetting('notifications', 'deadlineReminderDays', parseInt(e.target.value))}
                    >
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={7}>1 week before</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Reminder time</label>
                    <select
                      className="form-select text-xs"
                      value={settings.notifications.reminderTime || '09:00'}
                      onChange={(e) => updateSetting('notifications', 'reminderTime', e.target.value)}
                    >
                      <option value="09:00">9:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Project Status Updates */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="projectStatusUpdates"
                      className="mr-3"
                      checked={settings.notifications.projectStatusUpdates}
                      onChange={(e) => updateSetting('notifications', 'projectStatusUpdates', e.target.checked)}
                    />
                    <label htmlFor="projectStatusUpdates" className="text-sm font-medium text-gray-900">
                      Project Status Update Notifications
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-600 ml-6 mb-3">
                  Get notified when project status changes or important updates occur
                </p>
                <div className="ml-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="statusChangeNotification"
                        className="mr-2"
                        checked={settings.notifications.statusChangeNotification !== false}
                        onChange={(e) => updateSetting('notifications', 'statusChangeNotification', e.target.checked)}
                      />
                      <label htmlFor="statusChangeNotification" className="text-xs text-gray-700">
                        Status changes (pending → in-progress → completed)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newProjectAssignment"
                        className="mr-2"
                        checked={settings.notifications.newProjectAssignment !== false}
                        onChange={(e) => updateSetting('notifications', 'newProjectAssignment', e.target.checked)}
                      />
                      <label htmlFor="newProjectAssignment" className="text-xs text-gray-700">
                        New project assignments
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Progress Reports */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="weeklyReports"
                      className="mr-3"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                    />
                    <label htmlFor="weeklyReports" className="text-sm font-medium text-gray-900">
                      Weekly Progress Reports
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-600 ml-6 mb-3">
                  Receive weekly summaries of your projects and tasks
                </p>
                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Send on</label>
                    <select
                      className="form-select text-xs"
                      value={settings.notifications.weeklyReportDay || 'friday'}
                      onChange={(e) => updateSetting('notifications', 'weeklyReportDay', e.target.value)}
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Time</label>
                    <select
                      className="form-select text-xs"
                      value={settings.notifications.weeklyReportTime || '09:00'}
                      onChange={(e) => updateSetting('notifications', 'weeklyReportTime', e.target.value)}
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notification Options */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="overdueTasks"
                      className="mr-2"
                      checked={settings.notifications.overdueTasks !== false}
                      onChange={(e) => updateSetting('notifications', 'overdueTasks', e.target.checked)}
                    />
                    <label htmlFor="overdueTasks" className="text-xs text-gray-700">
                      Overdue task notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="teamUpdates"
                      className="mr-2"
                      checked={settings.notifications.teamUpdates !== false}
                      onChange={(e) => updateSetting('notifications', 'teamUpdates', e.target.checked)}
                    />
                    <label htmlFor="teamUpdates" className="text-xs text-gray-700">
                      Team member task completions (Managers only)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="systemUpdates"
                      className="mr-2"
                      checked={settings.notifications.systemUpdates !== false}
                      onChange={(e) => updateSetting('notifications', 'systemUpdates', e.target.checked)}
                    />
                    <label htmlFor="systemUpdates" className="text-xs text-gray-700">
                      System maintenance and updates
                    </label>
                  </div>
                </div>
              </div>
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