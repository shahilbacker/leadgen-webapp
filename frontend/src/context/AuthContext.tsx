'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, loginAdmin, refreshAccessToken } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const storedAccess = localStorage.getItem('leadgen_access_token');
      const storedRefresh = localStorage.getItem('leadgen_refresh_token');
      const storedUser = localStorage.getItem('leadgen_user');

      if (storedAccess && storedUser) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // LocalStorage access error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginAdmin(email, password);
      const { accessToken: newAccess, refreshToken: newRefresh, user: authUser } = res.data;

      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      setUser(authUser);

      localStorage.setItem('leadgen_access_token', newAccess);
      localStorage.setItem('leadgen_refresh_token', newRefresh);
      localStorage.setItem('leadgen_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    try {
      localStorage.removeItem('leadgen_access_token');
      localStorage.removeItem('leadgen_refresh_token');
      localStorage.removeItem('leadgen_user');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isViewer: user?.role === 'viewer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
