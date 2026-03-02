'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import BlogCard from '@/components/BlogCard';
import { FeedBlog } from '@/types';
import { useAuth } from '@/hooks/useAuth';

type RawFeedBlog = FeedBlog & {
  _id?: string;
  author?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  userId?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
};

function normalizeFeedBlog(raw: RawFeedBlog, currentUser?: { id?: string; firstName?: string; lastName?: string; profileImage?: string } | null): FeedBlog {
  const authorRaw = raw.author || {};
  const userRaw = raw.userId || {};
  const authorId = authorRaw.id || authorRaw._id || userRaw.id || userRaw._id || '';
  const authorFirstName = authorRaw.firstName || userRaw.firstName || '';
  const authorLastName = authorRaw.lastName || userRaw.lastName || '';

  const isCurrentUserAuthor =
    !!currentUser &&
    ((currentUser.id && authorId && currentUser.id === authorId) ||
      ((currentUser.firstName || '').toLowerCase() === authorFirstName.toLowerCase() &&
        (currentUser.lastName || '').toLowerCase() === authorLastName.toLowerCase()));

  const fallbackProfileImage =
    (!authorRaw.profileImage && !userRaw.profileImage && isCurrentUserAuthor && currentUser?.profileImage) || '';

  const user: { id?: string; _id?: string; firstName?: string; lastName?: string; profileImage?: string } = {
    id: authorRaw.id || userRaw.id,
    _id: authorRaw._id || userRaw._id,
    firstName: authorFirstName,
    lastName: authorLastName,
    profileImage: authorRaw.profileImage || userRaw.profileImage || fallbackProfileImage,
  };

  return {
    ...raw,
    id: raw.id || raw._id || '',
    author: {
      id: user.id || user._id || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.profileImage || '',
    },
  };
}

export default function FeedPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<FeedBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.getPublicFeed(currentPage, 10);
        setBlogs((response.data || []).map((blog: RawFeedBlog) => normalizeFeedBlog(blog, user)));
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [currentPage, user]);

  if (error) {
    return (
      <section className="page-shell">
        <div className="error-message">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-shell feed-page">
      <div className="page-head feed-head card">
        <div>
          <h1>Public Feed</h1>
          <p className="page-subtitle">Fresh stories from the Blog Rival community, shown as a live feed.</p>
        </div>
        <div className="feed-head-badges">
          <span className="pill">{blogs.length} stories on this page</span>
          <span className="pill">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="card empty-state feed-empty">
          <h3>No published blogs yet</h3>
          <p className="muted">Be the first one to publish something valuable for readers.</p>
        </div>
      ) : (
        <>
          <div className="feed-stream">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id || blog.slug || `${blog.title}-${index}`} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
