import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertCircle,
  Calendar,
  Briefcase,
  User
} from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (filter === 'unread') {
        params.append('unreadOnly', 'true');
      }

      const response = await axios.get(`/api/notifications?${params}`);
      setNotifications(response.data.notifications);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_deadline_reminder':
      case 'task_overdue':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'project_status_change':
      case 'project_assignment':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'task_assignment':
      case 'task_completion':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'weekly_report':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'system_update':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your project activities</p>
      </div>

      {/* Filter and Actions */}
      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Unread
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary flex items-center"
            >
              <CheckCheck size={16} className="mr-2" />
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                getPriorityColor(notification.priority)
              } ${!notification.isRead ? 'shadow-sm' : 'opacity-75'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    
                    <div 
                      className="text-sm text-gray-600 mb-2"
                      dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                    
                    {(notification.relatedProject || notification.relatedTask) && (
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {notification.relatedProject && (
                          <span className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {notification.relatedProject.title}
                          </span>
                        )}
                        {notification.relatedTask && (
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {notification.relatedTask.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchNotifications(i + 1)}
                className={`px-3 py-2 text-sm rounded-md ${
                  pagination.current === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;