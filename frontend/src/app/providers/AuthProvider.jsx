import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './useAuth';
import { login as loginRequest, logout as logoutRequest, refresh as refreshRequest } from '../../services/auth/authService';
import { clearCachedUserId, hasTokenExpired, parseAuthUser } from '../../services/auth/authSession';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../../services/auth/tokenStorage';
import { setUnauthorizedHandler } from '../../services/api/httpClient';

function normalizeUser(accessToken) {
  const parsed = parseAuthUser(accessToken);
  if (!parsed) {
    return null;
  }

  return {
    username: parsed.username,
    role: parsed.role,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [user, setUser] = useState(() => normalizeUser(getAccessToken()));

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearTokens();
      clearCachedUserId();
      setUser(null);
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    });
  }, [location.pathname, navigate]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        if (mounted) {
          setUser(null);
          setBootstrapping(false);
        }
        return;
      }

      if (!hasTokenExpired(accessToken)) {
        if (mounted) {
          setUser(normalizeUser(accessToken));
          setBootstrapping(false);
        }
        return;
      }

      try {
        const authPayload = await refreshRequest({ refreshToken });
        setTokens(authPayload);
        if (mounted) {
          setUser(normalizeUser(authPayload.accessToken));
        }
      } catch {
        clearTokens();
        clearCachedUserId();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials, options = {}) => {
    const authPayload = await loginRequest(credentials, options);
    setTokens(authPayload);
    clearCachedUserId();
    const nextUser = normalizeUser(authPayload.accessToken);
    setUser(nextUser);
    return nextUser;
  };

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutRequest({ refreshToken }, { suppressGlobalErrorToast: true });
      }
    } catch {
      // Best-effort logout; always continue with local token cleanup.
    } finally {
      clearTokens();
      clearCachedUserId();
      setUser(null);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole: (roles = []) => (user ? roles.includes(user.role) : false),
    }),
    [bootstrapping, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
