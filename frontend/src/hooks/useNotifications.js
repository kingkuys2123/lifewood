import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationAsUnread,
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
    const snapshot = items.find((item) => item.id === id);
    await markNotificationAsRead(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true, isRead: true } : item)),
    );
    if (snapshot && !(snapshot.read ?? snapshot.isRead)) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [items]);

  const onMarkOneUnread = useCallback(async (id) => {
    const snapshot = items.find((item) => item.id === id);
    await markNotificationAsUnread(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: false, isRead: false } : item)),
    );
    if (snapshot && (snapshot.read ?? snapshot.isRead)) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [items]);

  const onDeleteOne = useCallback(async (id) => {
    const snapshot = items.find((item) => item.id === id);
    await deleteNotification(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    const removedUnread = Boolean(snapshot && !(snapshot.read ?? snapshot.isRead));
    if (removedUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [items]);

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
      markOneUnread: onMarkOneUnread,
      deleteOne: onDeleteOne,
    }),
    [items, unreadCount, loading, loadNotifications, onMarkAllRead, onMarkOneRead, onMarkOneUnread, onDeleteOne],
  );
}
