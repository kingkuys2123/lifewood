import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function login(payload) {
  const response = await httpClient.post('/auth/login', payload);
  return unwrapApiResponse(response);
}

export async function refresh(payload) {
  const response = await httpClient.post('/auth/refresh', payload);
  return unwrapApiResponse(response);
}
