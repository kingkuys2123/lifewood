const ADMIN_GATE_KEY = 'lifewood.adminGate';

function readGateState() {
  const raw = window.sessionStorage.getItem(ADMIN_GATE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.expiresAt) {
      clearAdminGateAccess();
      return null;
    }

    if (Date.now() >= parsed.expiresAt) {
      clearAdminGateAccess();
      return null;
    }

    return parsed;
  } catch {
    clearAdminGateAccess();
    return null;
  }
}

export function setAdminGateAccess({ token, expiresInMs }) {
  if (!token || !Number.isFinite(expiresInMs) || expiresInMs <= 0) {
    return;
  }

  const expiresAt = Date.now() + expiresInMs;
  window.sessionStorage.setItem(ADMIN_GATE_KEY, JSON.stringify({ token, expiresAt }));
}

export function getAdminGateToken() {
  return readGateState()?.token || '';
}

export function hasAdminGateAccess() {
  return Boolean(readGateState()?.token);
}

export function clearAdminGateAccess() {
  window.sessionStorage.removeItem(ADMIN_GATE_KEY);
}

