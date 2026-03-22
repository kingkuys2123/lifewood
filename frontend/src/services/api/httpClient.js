import axios from 'axios';
import { normalizeApiError, unwrapApiResponse } from './apiResponse';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../auth/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let refreshPromise = null;
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function refreshTokens() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      .then((response) => {
        const data = unwrapApiResponse(response);
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data.accessToken;
      })
      .catch((error) => {
        clearTokens();
        unauthorizedHandler?.(normalizeApiError(error));
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401 && !originalRequest?._retry && getRefreshToken()) {
      originalRequest._retry = true;
      try {
        const nextToken = await refreshTokens();
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return httpClient(originalRequest);
      } catch {
        return Promise.reject(normalizeApiError(error));
      }
    }

    if (status === 401 && !getRefreshToken()) {
      unauthorizedHandler?.(normalizeApiError(error));
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default httpClient;
