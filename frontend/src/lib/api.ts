import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Get Firebase ID token automatically
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = { ...options, headers };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'API request failed');
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const init: RequestInit = { ...options, method: 'POST' };
    if (body && !(body instanceof FormData)) init.body = JSON.stringify(body);
    else if (body instanceof FormData) init.body = body;
    return apiClient<T>(endpoint, init);
  },
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const init: RequestInit = { ...options, method: 'PATCH' };
    if (body) init.body = JSON.stringify(body);
    return apiClient<T>(endpoint, init);
  },
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
