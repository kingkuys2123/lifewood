import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function fetchUsers({ keyword = '', pageIndex = 0, pageSize = 10 } = {}) {
  const response = await httpClient.get('/user/get/all', {
    params: {
      keyword: keyword || undefined,
      page: pageIndex,
      size: pageSize,
    },
  });

  return unwrapApiResponse(response);
}

export async function fetchUserById(id) {
  const response = await httpClient.get('/user/get', { params: { id } });
  return unwrapApiResponse(response);
}

export async function fetchMyProfile() {
  const response = await httpClient.get('/user/me');
  return unwrapApiResponse(response);
}

export async function createUser(payload) {
  const response = await httpClient.post('/user/create', payload);
  return unwrapApiResponse(response);
}

export async function updateUser(id, payload) {
  const response = await httpClient.put('/user/update', payload, { params: { id } });
  return unwrapApiResponse(response);
}

export async function updateMyProfile(payload) {
  const response = await httpClient.put('/user/me', payload);
  return unwrapApiResponse(response);
}

export async function deleteUser(id) {
  const response = await httpClient.delete('/user/delete', { params: { id } });
  return unwrapApiResponse(response);
}

export async function changePassword(id, payload) {
  const response = await httpClient.patch('/user/change-password', payload, { params: { id } });
  return unwrapApiResponse(response);
}

export async function changeMyPassword(payload) {
  const response = await httpClient.patch('/user/me/change-password', payload);
  return unwrapApiResponse(response);
}

export async function resetUserPassword(id, payload) {
  const response = await httpClient.patch('/user/reset-password', payload, { params: { id } });
  return unwrapApiResponse(response);
}

