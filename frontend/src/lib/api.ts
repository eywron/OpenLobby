const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    let response = await fetch(url, config);

    // Handle 401 Unauthorized - attempt to refresh token
    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            setAccessToken(refreshData.data.accessToken);
            // Retry the original request
            headers.set('Authorization', `Bearer ${refreshData.data.accessToken}`);
            response = await fetch(url, { ...config, headers });
          }
        } else {
          // Refresh failed, user needs to login
          setAccessToken(null);
        }
      } catch (e) {
        setAccessToken(null);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'API request failed');
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const init: RequestInit = { ...options, method: 'POST' };
    if (body) init.body = JSON.stringify(body);
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
