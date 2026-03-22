import { jwtDecode } from 'jwt-decode';

const USER_ID_KEY = 'lifewood.userId';

export function parseAuthUser(accessToken) {
  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode(accessToken);
    return {
      username: decoded.sub || '',
      role: decoded.role || '',
      exp: decoded.exp || 0,
    };
  } catch {
    return null;
  }
}

export function hasTokenExpired(accessToken) {
  const parsed = parseAuthUser(accessToken);
  if (!parsed?.exp) {
    return true;
  }

  return parsed.exp * 1000 <= Date.now();
}

export function getCachedUserId() {
  const value = window.localStorage.getItem(USER_ID_KEY);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function cacheUserId(userId) {
  if (typeof userId === 'number') {
    window.localStorage.setItem(USER_ID_KEY, String(userId));
  }
}

export function clearCachedUserId() {
  window.localStorage.removeItem(USER_ID_KEY);
}
