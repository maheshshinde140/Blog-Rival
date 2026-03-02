'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Comment, PaginatedResponse } from '@/types';

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchComments = useCallback(async (blogId: string, page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getComments(blogId, page, limit);
      setComments(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createComment = useCallback(async (blogId: string, content: string) => {
    setError(null);
    try {
      const response = await apiClient.createComment(blogId, content);
      setComments(prev => [response, ...prev]);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create comment');
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (blogId: string, commentId: string) => {
    setError(null);
    try {
      await apiClient.deleteComment(blogId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      throw err;
    }
  }, []);

  return {
    comments,
    isLoading,
    error,
    pagination,
    fetchComments,
    createComment,
    deleteComment,
  };
}
