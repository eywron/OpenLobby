'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setAccessToken } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>('/users/me');
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.post<{ success: boolean; data: { accessToken: string; user: User } }>('/auth/login', credentials);
    if (res.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
  };

  const register = async (credentials: any) => {
    const res = await api.post<{ success: boolean; data: { accessToken: string; user: User } }>('/auth/register', credentials);
    if (res.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
