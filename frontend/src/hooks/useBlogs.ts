'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Blog, PaginatedResponse } from '@/types';

type RawBlog = Blog & { _id?: string };

function normalizeBlog(raw: RawBlog): Blog {
  return {
    ...raw,
    id: raw.id || raw._id || '',
  };
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchUserBlogs = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getUserBlogs(page, limit);
      setBlogs((response.data || []).map((blog: RawBlog) => normalizeBlog(blog)));
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBlog = useCallback(async (data: {
    title: string;
    content: string;
    summary?: string;
    isPublished?: boolean;
    featuredImage?: string;
  }) => {
    setError(null);
    try {
      const response = await apiClient.createBlog(data);
      const normalized = normalizeBlog(response as RawBlog);
      setBlogs(prev => [normalized, ...prev]);
      return normalized;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create blog');
      throw err;
    }
  }, []);

  const updateBlog = useCallback(async (id: string, data: any) => {
    setError(null);
    try {
      const response = await apiClient.updateBlog(id, data);
      const normalized = normalizeBlog(response as RawBlog);
      setBlogs(prev => prev.map(b => (b.id === id ? normalized : b)));
      return normalized;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog');
      throw err;
    }
  }, []);

  const deleteBlog = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiClient.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      throw err;
    }
  }, []);

  return {
    blogs,
    isLoading,
    error,
    pagination,
    fetchUserBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
