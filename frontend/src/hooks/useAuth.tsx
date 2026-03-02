'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authStorage } from '@/lib/authStorage';
import { apiClient } from '@/lib/apiClient';
import { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<User>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    location?: string;
    website?: string;
  }) => Promise<User>;
  uploadProfileImage: (file: File) => Promise<{ profileImage: string }>;
  requestPasswordReset: (email: string) => Promise<{ message: string; resetToken?: string; expiresAt?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authStorage.isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const cachedUser = authStorage.getUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
        authStorage.setUser(currentUser);
      } catch {
        authStorage.clearAll();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.register(email, password, firstName, lastName);
      authStorage.setToken(response.accessToken);
      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }
      authStorage.setUser(response.user);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      authStorage.setToken(response.accessToken);
      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }
      authStorage.setUser(response.user);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authStorage.clearAll();
    setUser(null);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    setError(null);
    try {
      const profile = await apiClient.getMyProfile();
      setUser(profile);
      authStorage.setUser(profile);
      return profile;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load profile';
      setError(message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImage?: string;
      bio?: string;
      location?: string;
      website?: string;
    }) => {
      setError(null);
      try {
        const profile = await apiClient.updateMyProfile(data);
        setUser(profile);
        authStorage.setUser(profile);
        return profile;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to update profile';
        setError(message);
        throw err;
      }
    },
    [],
  );

  const uploadProfileImage = useCallback(async (file: File) => {
    setError(null);
    try {
      const response = await apiClient.uploadMyProfileImage(file);
      setUser(prev => {
        if (!prev) return prev;
        const nextUser = { ...prev, profileImage: response.profileImage };
        authStorage.setUser(nextUser);
        return nextUser;
      });
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to upload profile image';
      setError(message);
      throw err;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    try {
      return await apiClient.requestPasswordReset(email);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to request password reset';
      setError(message);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setError(null);
    try {
      return await apiClient.resetPassword(token, password);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reset password';
      setError(message);
      throw err;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      error,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      refreshProfile,
      updateProfile,
      uploadProfileImage,
      requestPasswordReset,
      resetPassword,
    }),
    [
      user,
      isLoading,
      error,
      register,
      login,
      logout,
      refreshProfile,
      updateProfile,
      uploadProfileImage,
      requestPasswordReset,
      resetPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
