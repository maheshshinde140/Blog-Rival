'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import { apiClient } from '@/lib/apiClient';

export default function CreateBlogPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { createBlog, isLoading, error } = useBlogs();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    isPublished: false,
  });

  const imagePreview = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const blog = await createBlog(formData);
      if (imageFile && blog?.id) {
        await apiClient.uploadBlogFeaturedImage(blog.id, imageFile);
      }
      router.push('/dashboard');
    } catch {
      // Error handled in hook
    }
  };

  if (authLoading) return <div className="loading"><div className="spinner"></div></div>;
  if (!isAuthenticated) return null;

  return (
    <section className="editor-wrap page-shell">
      <div className="card">
        <h1 className="card-title">Create New Blog</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <input
              type="text"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="featuredImageFile">Featured Image</label>
            <input
              type="file"
              id="featuredImageFile"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {imagePreview && (
            <div className="blog-image-preview">
              <Image src={imagePreview} alt="Blog image preview" width={640} height={360} unoptimized />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              minLength={10}
            ></textarea>
          </div>

          <div className="form-group checkbox-label">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <label htmlFor="isPublished">Publish immediately</label>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Blog'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
