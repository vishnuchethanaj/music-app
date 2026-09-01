import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (n: any) => {
    await markAsRead(n._id);
    if (n.type === 'FOLLOW') navigate(`/artist/${n.senderId}`);
    else if (n.type === 'LIKE' || n.type === 'NEW_SONG') navigate(`/song/${n.songId}`);
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black">Notifications</h1>
        <button onClick={markAllAsRead} className="text-sm text-brand-primary font-bold">Mark all as read</button>
      </div>
      {notifications.length === 0 && <p className="card text-text-secondary text-sm text-center pt-10">No notifications yet.</p>}
      {notifications.map(n => (
        <div 
          key={n._id} 
          onClick={() => handleNotificationClick(n)}
          className={`card p-4 flex items-center gap-4 cursor-pointer ${n.isRead ? 'opacity-70' : 'border-brand-primary'}`}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{n.message}</p>
            <p className="text-xs text-text-secondary">{new Date(n.createdAt).toLocaleDateString()}</p>
          </div>
          {!n.isRead && <div className="w-2 h-2 bg-brand-primary rounded-full"></div>}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
