'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    isPublished: false,
  });

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return existingImage;
  }, [imageFile, existingImage]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchBlog = async () => {
        try {
          if (!id) return;
          const data = await apiClient.getBlogById(id);
          setFormData({
            title: data.title,
            content: data.content,
            summary: data.summary || '',
            isPublished: data.isPublished,
          });
          setExistingImage(data.featuredImage || '');
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load blog');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    }
  }, [isAuthenticated, id]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

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
    setError(null);
    try {
      if (!id) return;
      await apiClient.updateBlog(id, formData);
      if (imageFile) {
        await apiClient.uploadBlogFeaturedImage(id, imageFile);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog');
    }
  };

  if (authLoading || isLoading) return <div className="loading"><div className="spinner"></div></div>;
  if (!isAuthenticated) return null;
  if (error) return <section className="page-shell"><div className="error-message">{error}</div></section>;

  return (
    <section className="editor-wrap page-shell">
      <div className="card">
        <h1 className="card-title">Edit Blog</h1>

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
            <label htmlFor="isPublished">Published</label>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              Update Blog
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
