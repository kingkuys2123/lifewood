import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function login(payload, options = {}) {
  const response = await httpClient.post('/auth/login', payload, {
    suppressGlobalErrorToast: options.suppressGlobalErrorToast,
  });
  return unwrapApiResponse(response);
}

export async function refresh(payload) {
  const response = await httpClient.post('/auth/refresh', payload);
  return unwrapApiResponse(response);
}
