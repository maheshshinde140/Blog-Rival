'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import BlogCard from '@/components/BlogCard';
import { FeedBlog } from '@/types';

type RawFeedBlog = FeedBlog & {
  _id?: string;
  userId?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
  };
};

function normalizeFeedBlog(raw: RawFeedBlog): FeedBlog {
  const user: { id?: string; _id?: string; firstName?: string; lastName?: string } =
    (raw.author as { id?: string; _id?: string; firstName?: string; lastName?: string }) ||
    raw.userId ||
    {};
  return {
    ...raw,
    id: raw.id || raw._id || '',
    author: {
      id: user.id || user._id || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    },
  };
}

export default function FeedPage() {
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
        setBlogs((response.data || []).map((blog: RawFeedBlog) => normalizeFeedBlog(blog)));
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [currentPage]);

  if (error) {
    return (
      <section className="page-shell">
        <div className="error-message">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="page-head">
        <div>
          <h1>Public Feed</h1>
          <p className="page-subtitle">Discover recent posts from the community.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="card empty-state">
          <p>No published blogs yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-2">
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
