'use client';

/**
 * OraQL_ API client.
 * Handles auth tokens, request/response interceptors, and error handling.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null | undefined) {
    const valid = typeof token === 'string' && token.length > 0 && token !== 'undefined' && token !== 'null';
    this.accessToken = valid ? (token as string) : null;
    if (typeof window === 'undefined') return;
    if (valid) {
      localStorage.setItem('oracle_token', token as string);
    } else {
      localStorage.removeItem('oracle_token');
    }
  }

  getToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('oracle_token');
      if (stored && stored !== 'undefined' && stored !== 'null') return stored;
    }
    return null;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE}${API_PREFIX}${path}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));

      if (response.status === 401) {
        // Clear stale token; AuthGuard will route to /auth via the router.
        this.setToken(null);
      }

      throw new ApiError(response.status, error.message || 'Request failed', error.errors);
    }

    const json = await response.json();
    // Backend wraps responses in { success, data } via TransformInterceptor
    return json.data !== undefined ? json.data : json;
  }

  // ─── HTTP Methods ───

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Singleton instance
export const api = new ApiClient();
