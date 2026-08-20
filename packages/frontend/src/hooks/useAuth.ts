'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  login as authLogin,
  logout as authLogout,
  getToken,
  getUser,
  isAuthenticated,
  type AuthUser,
} from '@/lib/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

/**
 * Hook providing auth state and actions for the admin panel.
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check existing auth state on mount (getToken validates expiry)
    const existingToken = getToken();
    const existingUser = getUser();
    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(existingUser);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authLogin(email, password);
      setToken(result.token);
      setUser(result.user);
      setIsLoggedIn(true);
      router.push('/admin/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    authLogout();
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    router.push('/admin/login');
  }, [router]);

  return { user, token, isLoggedIn, isLoading, login, logout, error };
}

/**
 * Hook that redirects to login if not authenticated.
 * Returns auth state once verified.
 */
export function useRequireAuth(): UseAuthReturn {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isLoggedIn) {
      router.push('/admin/login');
    }
  }, [auth.isLoading, auth.isLoggedIn, router]);

  return auth;
}
