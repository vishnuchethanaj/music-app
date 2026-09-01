import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authTokenStorageKey } from '../api/axios';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '../api/auth';
import api from '../api/axios';

export type Song = {
  _id: string;
  title: string;
  artistName: string;
  artistId: string;
  audioUrl: string;
  coverUrl: string;
  genre: string;
  description: string;
  duration: number;
  plays: number;
  likes: number;
  status: 'draft' | 'published';
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  becomeArtist: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(authTokenStorageKey));
  const [loading, setLoading] = useState(true);

  const storeSession = useCallback((newToken: string, authenticatedUser: AuthUser) => {
    localStorage.setItem(authTokenStorageKey, newToken);
    setToken(newToken);
    setUser(authenticatedUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(authTokenStorageKey);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(authTokenStorageKey);

    if (!storedToken) {
      clearSession();
      return;
    }

    const currentUser = await getCurrentUser();
    setToken(storedToken);
    setUser(currentUser);
  }, [clearSession]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginUser(payload);
      storeSession(response.token, response.user);
      return response.user;
    },
    [storeSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerUser(payload);
      storeSession(response.token, response.user);
      return response.user;
    },
    [storeSession],
  );

  const becomeArtist = useCallback(async () => {
    const response = await api.post<{ user: AuthUser }>('/artist/become');
    setUser(response.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(authTokenStorageKey)) {
        await logoutUser();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        await refreshUser();
      } catch {
        clearSession();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [clearSession, refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshUser,
      becomeArtist,
    }),
    [user, token, loading, login, register, logout, refreshUser, becomeArtist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
