'use client';

import { API_BASE_URL } from './api';

const TOKEN_KEY = '1plus_admin_token';
const USER_KEY = '1plus_admin_user';
const TOKEN_EXPIRY_KEY = '1plus_admin_token_expiry';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: AuthUser;
}

/**
 * Store the JWT token and its expiry time in localStorage
 */
export function setToken(token: string, expiresIn?: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }
}

/**
 * Get the JWT token from localStorage, checking expiry first
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      // Token has expired, clear auth data
      logout();
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Store user data in localStorage
 */
export function setUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Get user data from localStorage
 */
export function getUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Check if user is authenticated (has a non-expired token)
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Login failed');
  }

  const { token, expiresIn, user } = data.data;
  setToken(token, expiresIn);
  setUser(user);

  return { token, expiresIn, user };
}

/**
 * Logout - clear all auth data
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
}
