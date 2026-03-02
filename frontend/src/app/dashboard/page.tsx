'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import BlogCard from '@/components/BlogCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { blogs, pagination, isLoading, error, fetchUserBlogs, deleteBlog } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBlogs(currentPage, 10);
    }
  }, [isAuthenticated, currentPage, fetchUserBlogs]);

  if (authLoading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) return null;

  return (
    <section className="page-shell">
      <div className="page-head">
        <div>
          <h1>My Blogs</h1>
          <p className="page-subtitle">Manage drafts and published articles.</p>
        </div>
        <div className="btn-group">
          <Link href="/dashboard/profile" className="btn btn-secondary">
            My Profile
          </Link>
          <Link href="/dashboard/create" className="btn btn-primary">
            Create New Blog
          </Link>
        </div>
      </div>

      {user && (
        <div className="card profile-mini">
          <div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p className="muted">{user.email}</p>
            {user.bio && <p style={{ marginTop: '0.5rem' }}>{user.bio}</p>}
          </div>
          <Link href="/dashboard/profile" className="btn btn-secondary">
            Edit Profile
          </Link>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : blogs.length === 0 ? (
        <div className="card empty-state">
          <p>You have not created any blogs yet.</p>
          <Link href="/dashboard/create" className="btn btn-primary" style={{ marginTop: '0.9rem' }}>
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-2">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.id || blog.slug || `${blog.title}-${index}`}
                blog={{
                  id: blog.id,
                  title: blog.title,
                  slug: blog.slug,
                  summary: blog.summary,
                  featuredImage: blog.featuredImage,
                  author: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName } : { id: '', firstName: '', lastName: '' },
                  likeCount: blog.likeCount,
                  commentCount: blog.commentCount,
                  createdAt: blog.createdAt,
                }}
                isOwner={true}
                onEdit={id => router.push(`/dashboard/edit/${id}`)}
                onDelete={deleteBlog}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
