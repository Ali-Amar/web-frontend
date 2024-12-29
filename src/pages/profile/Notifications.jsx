import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  Badge,
  Alert,
  Select
} from 'flowbite-react';
import {
  HiOutlineBell,
  HiCheck,
  HiTrash,
  HiShoppingBag,
  HiUserGroup,
  HiAcademicCap,
  HiChat,
  HiClock,
  HiExclamation,
  HiInformationCircle
} from 'react-icons/hi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { timeAgo } from '../../utils/helpers';

const Notifications = () => {
  const { currentUser, accessToken } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/notifications?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notif =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/notifications/mark-all-read',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notif => notif._id !== notificationId)
        );
        if (!notifications.find(n => n._id === notificationId)?.read) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: HiShoppingBag,
      mentorship: HiUserGroup,
      course: HiAcademicCap,
      message: HiChat,
      system: HiInformationCircle
    };
    return icons[type] || HiBell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: 'blue',
      mentorship: 'purple',
      course: 'green',
      message: 'yellow',
      system: 'gray'
    };
    return colors[type] || 'blue';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' ? 'اطلاعات' : 'Notifications'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {unreadCount > 0 && (
              <span>
                {language === 'ur'
                  ? `${unreadCount} نئی اطلاعات`
                  : `${unreadCount} new notifications`}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">
              {language === 'ur' ? 'تمام' : 'All'}
            </option>
            <option value="unread">
              {language === 'ur' ? 'غیر پڑھی' : 'Unread'}
            </option>
            <option value="order">
              {language === 'ur' ? 'آرڈرز' : 'Orders'}
            </option>
            <option value="mentorship">
              {language === 'ur' ? 'رہنمائی' : 'Mentorship'}
            </option>
            <option value="course">
              {language === 'ur' ? 'کورسز' : 'Courses'}
            </option>
            <option value="message">
              {language === 'ur' ? 'پیغامات' : 'Messages'}
            </option>
          </Select>

          {unreadCount > 0 && (
            <Button
              color="gray"
              size="sm"
              onClick={markAllAsRead}
            >
              <HiCheck className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'سب پڑھی ہوئی' : 'Mark All Read'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <HiOutlineBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'کوئی اطلاع نہیں' : 'No notifications'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ur'
                  ? 'آپ کے پاس ابھی تک کوئی اطلاع نہیں ہے'
                  : 'You don\'t have any notifications yet'}
              </p>
            </div>
          </Card>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type);

            return (
              <Card
                key={notification._id}
                className={`
                  relative
                  ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {language === 'ur' ? notification.titleUrdu : notification.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {language === 'ur' ? notification.messageUrdu : notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge color="blue">
                            {language === 'ur' ? 'نئی' : 'New'}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      {notification.actionUrl && (
                        <Button
                          as={Link}
                          to={notification.actionUrl}
                          size="sm"
                          color={color}
                        >
                          {language === 'ur' ? 'دیکھیں' : 'View'}
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          size="sm"
                          color="gray"
                          onClick={() => markAsRead(notification._id)}
                        >
                          <HiCheck className="w-4 h-4 mr-2" />
                          {language === 'ur' ? 'پڑھی ہوئی' : 'Mark as Read'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <HiTrash className="w-4 h-4 mr-2" />
                        {language === 'ur' ? 'حذف کریں' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;