'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

export function useLikes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLike = useCallback(async (blogId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.addLike(blogId);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to like blog';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeLike = useCallback(async (blogId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.removeLike(blogId);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to unlike blog';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, addLike, removeLike };
}
