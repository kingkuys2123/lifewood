import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function fetchNotifications({ userId, isRead, keyword = '', pageIndex = 0, pageSize = 10 } = {}) {
  const response = await httpClient.get('/notification/get/all', {
    params: {
      userId,
      isRead,
      keyword: keyword || undefined,
      page: pageIndex,
      size: pageSize,
    },
  });

  return unwrapApiResponse(response);
}

export async function fetchUnreadNotifications({ userId, pageIndex = 0, pageSize = 10 } = {}) {
  const response = await httpClient.get('/notification/get/unread', {
    params: { userId, page: pageIndex, size: pageSize },
  });

  return unwrapApiResponse(response);
}

export async function fetchUnreadCount({ userId } = {}) {
  const response = await httpClient.get('/notification/get/unread/count', {
    params: { userId },
  });

  return unwrapApiResponse(response);
}

export async function markNotificationAsRead(notificationId) {
  const response = await httpClient.patch('/notification/mark/read', { notificationId });
  return unwrapApiResponse(response);
}

export async function markAllNotificationsAsRead({ userId } = {}) {
  const response = await httpClient.patch('/notification/mark/all/read', null, {
    params: { userId },
  });

  return unwrapApiResponse(response);
}

export async function deleteNotification(id) {
  const response = await httpClient.delete('/notification/delete', { params: { id } });
  return unwrapApiResponse(response);
}
