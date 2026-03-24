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

export async function forgotPassword(payload, options = {}) {
  const response = await httpClient.post('/auth/forgot-password', payload, {
    suppressGlobalErrorToast: options.suppressGlobalErrorToast,
  });
  return unwrapApiResponse(response);
}

export async function resetPassword(payload, options = {}) {
  const response = await httpClient.post('/auth/reset-password', payload, {
    suppressGlobalErrorToast: options.suppressGlobalErrorToast,
  });
  return unwrapApiResponse(response);
}

export async function validateResetToken(token, options = {}) {
  const response = await httpClient.post('/auth/reset-password/validate', null, {
    params: { token },
    suppressGlobalErrorToast: options.suppressGlobalErrorToast,
  });
  return unwrapApiResponse(response);
}

export async function logout(payload, options = {}) {
  const response = await httpClient.post('/auth/logout', payload, {
    suppressGlobalErrorToast: options.suppressGlobalErrorToast,
  });
  return unwrapApiResponse(response);
}
