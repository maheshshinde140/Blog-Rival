'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    error,
    refreshProfile,
    updateProfile,
    uploadProfileImage,
  } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  });

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return user?.profileImage || '';
  }, [imageFile, user?.profileImage]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile().catch(() => {});
    }
  }, [isAuthenticated, refreshProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccess(null);
    setIsSaving(true);
    try {
      await updateProfile(formData);
      if (imageFile) {
        await uploadProfileImage(imageFile);
      }
      setImageFile(null);
      await refreshProfile();
      setSuccess('Profile updated successfully');
    } catch {
      // Error handled by hook
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="loading"><div className="spinner"></div></div>;
  if (!isAuthenticated) return null;

  return (
    <section className="editor-wrap page-shell">
      <div className="card">
        <h1 className="card-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and avatar.</p>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="profileImageFile">Profile Image</label>
            <input id="profileImageFile" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <div className="profile-preview">
              <Image src={imagePreview} alt="Profile preview" width={640} height={360} unoptimized />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} style={{ minHeight: '90px' }} />
          </div>

          <div className="profile-grid">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="url" placeholder="https://your-site.com" value={formData.website} onChange={handleChange} />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
