// pages/notifications/NotificationsPage.tsx
import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Bell, CheckCircle, AlertCircle, Info, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Campaign Sent',
    message: 'Your campaign "Weekly Newsletter" was sent to 1,247 contacts',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New Contact Added',
    message: 'Sarah Johnson subscribed to your mailing list',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'High Bounce Rate',
    message: 'Campaign "Promotional Offer" has a bounce rate of 8.5%',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Contact Import Complete',
    message: 'Successfully imported 847 contacts from CSV',
    time: '2 days ago',
    read: true,
  },
];

const iconMap = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: 'text-green-600 bg-green-50 border-green-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {['all', 'unread'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === option
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const Icon = iconMap[notification.type];
          const colorClass = colorMap[notification.type];

          return (
            <Card
              key={notification.id}
              className={`p-4 border-l-4 transition-opacity ${
                !notification.read ? 'bg-blue-50/50' : 'opacity-70'
              } ${colorClass}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <span className="text-xs text-blue-600 font-medium">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}