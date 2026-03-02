'use client';

import { useState, useCallback, useEffect } from 'react';
import { authStorage } from '@/lib/authStorage';
import { apiClient } from '@/lib/apiClient';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (authStorage.isAuthenticated()) {
        try {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
        } catch {
          authStorage.clearAll();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setError(null);
    try {
      const response = await apiClient.register(email, password, firstName, lastName);
      authStorage.setToken(response.accessToken);
      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.login(email, password);
      authStorage.setToken(response.accessToken);
      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authStorage.clearAll();
    setUser(null);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await apiClient.getMyProfile();
      setUser(profile);
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
      setUser(prev => (prev ? { ...prev, profileImage: response.profileImage } : prev));
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

  return {
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
  };
}
