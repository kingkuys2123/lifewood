import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notifications/notificationsService';
import { createNotificationSocket } from '../services/websocket/notificationSocket';

export function useNotifications({ userId, enabled = true, pageSize = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setLoading(true);
      const [notificationPage, unread] = await Promise.all([
        fetchNotifications({ userId, pageIndex: 0, pageSize }),
        fetchUnreadCount({ userId }),
      ]);

      setItems(notificationPage?.content || []);
      setUnreadCount(unread || 0);
    } finally {
      setLoading(false);
    }
  }, [enabled, pageSize, userId]);

  const onMarkAllRead = useCallback(async () => {
    await markAllNotificationsAsRead({ userId });
    setItems((prev) => prev.map((item) => ({ ...item, read: true, isRead: true })));
    setUnreadCount(0);
  }, [userId]);

  const onMarkOneRead = useCallback(async (id) => {
    await markNotificationAsRead(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true, isRead: true } : item)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    socketRef.current = createNotificationSocket((payload) => {
      if (!payload) {
        loadNotifications();
        return;
      }

      setItems((prev) => [{ ...payload, read: payload.isRead }, ...prev].slice(0, pageSize));
      if (!payload.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    const fallbackPoll = window.setInterval(loadNotifications, 30000);

    return () => {
      window.clearInterval(fallbackPoll);
      socketRef.current?.deactivate();
    };
  }, [enabled, loadNotifications, pageSize]);

  return useMemo(
    () => ({
      notifications: items.map((item) => ({ ...item, read: item.read ?? item.isRead })),
      unreadCount,
      loading,
      reload: loadNotifications,
      markAllRead: onMarkAllRead,
      markOneRead: onMarkOneRead,
    }),
    [items, unreadCount, loading, loadNotifications, onMarkAllRead, onMarkOneRead],
  );
}
