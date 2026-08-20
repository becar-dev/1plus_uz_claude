'use client';

import type { Project, ApiResponse } from '@1plus/shared';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Typed fetch wrapper with error handling for the 1PLUS backend API.
 * Handles auth token injection and returns typed responses.
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Fetch all published projects from the backend.
 */
export async function fetchProjects(
  status?: string
): Promise<ApiResponse<Project[]>> {
  const params = status ? `?status=${status}` : '';
  return apiFetch<Project[]>(`/projects${params}`);
}

/**
 * Fetch a single project by ID.
 */
export async function fetchProject(
  id: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`);
}

/**
 * Fetch a project by slug (uses the direct /:id endpoint which supports slug lookup).
 */
export async function fetchProjectBySlug(
  slug: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${slug}`);
}

export { apiFetch, API_BASE_URL };
