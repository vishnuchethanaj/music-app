import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../api/axios';

export type Notification = {
  _id: string;
  type: 'FOLLOW' | 'LIKE' | 'NEW_SONG';
  message: string;
  isRead: boolean;
  createdAt: string;
  songId?: string;
  artistId?: string;
};

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        api.get<{ data: Notification[] }>('/notifications'),
        api.get<{ unreadCount: number }>('/notifications/unread-count'),
      ]);
      setNotifications(notifsRes.data.data);
      setUnreadCount(countRes.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    await fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    await api.put('/notifications/read-all');
    await fetchNotifications();
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead }),
    [notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
