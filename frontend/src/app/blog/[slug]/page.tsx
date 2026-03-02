'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import { PublicBlog } from '@/types';
import { formatDate, getAuthorName } from '@/lib/utils';
import LikeButton from '@/components/LikeButton';
import CommentItem from '@/components/CommentItem';

export default function BlogPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { user, isAuthenticated } = useAuth();
  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
    pagination,
    fetchComments,
    createComment,
    deleteComment,
  } = useComments();

  const [blog, setBlog] = useState<PublicBlog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentPage, setCommentPage] = useState(1);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!slug) return;
        const data = await apiClient.getPublicBlogBySlug(slug);
        setBlog(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Blog not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      fetchComments(blog.id, commentPage, 10);
    }
  }, [blog, commentPage, fetchComments]);

  const handleAddComment = async (e: any) => {
    e.preventDefault();
    if (!newComment.trim() || !blog) return;

    setIsSubmittingComment(true);
    try {
      await createComment(blog.id, newComment);
      setNewComment('');
      await fetchComments(blog.id, 1, 10);
      setCommentPage(1);
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="error-message">{error}</div>
      </section>
    );
  }

  if (!blog) return null;

  const isOwnBlog = user?.id === blog.author.id;
  const blogAuthorInitials =
    `${(blog.author.firstName?.[0] || '').toUpperCase()}${(blog.author.lastName?.[0] || '').toUpperCase()}` || 'BR';

  return (
    <section className="blog-wrap page-shell">
      <article className="card">
        <div className="blog-author-head">
          {blog.author.profileImage ? (
            <Image
              src={blog.author.profileImage}
              alt={getAuthorName(blog.author.firstName, blog.author.lastName)}
              className="blog-author-avatar-image"
              width={88}
              height={88}
              unoptimized
            />
          ) : (
            <span className="blog-author-avatar-fallback">
              {blogAuthorInitials}
            </span>
          )}
          <div>
            <p className="blog-author-name">{getAuthorName(blog.author.firstName, blog.author.lastName)}</p>
            <p className="muted">
              {formatDate(blog.createdAt)}
              {isOwnBlog ? ' | Your post' : ''}
            </p>
          </div>
        </div>

        {blog.featuredImage && (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            className="blog-image"
            width={1200}
            height={675}
            unoptimized
          />
        )}

        <h1>{blog.title}</h1>

        <div className="content-article" style={{ marginTop: '1.4rem', fontSize: '1.06rem' }}>
          {blog.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="stat-row" style={{ marginTop: '1rem' }}>
          {isAuthenticated ? (
            <LikeButton blogId={blog.id} initialCount={blog.likeCount} />
          ) : (
            <span className="pill">{blog.likeCount} likes</span>
          )}
          <span className="pill">{blog.commentCount} comments</span>
        </div>
      </article>

      <div style={{ marginTop: '1.6rem' }}>
        <h2>Comments</h2>

        {isAuthenticated ? (
          <div className="card" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <form onSubmit={handleAddComment}>
              <div className="form-group">
                <label htmlFor="comment">Add a comment</label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your thoughts"
                  style={{ minHeight: '100px' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmittingComment || !newComment.trim()}>
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card empty-state" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <p>
              Please <Link href="/auth/login">login</Link> to comment.
            </p>
          </div>
        )}

        {commentsError && <div className="error-message">{commentsError}</div>}

        <div className="grid" style={{ gap: '0.8rem' }}>
          {commentsLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="card empty-state">
              <p>No comments yet. Be the first one.</p>
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={isAuthenticated && user?.id === comment.author.id}
                onDelete={async () => {
                  await deleteComment(blog.id, comment.id);
                  await fetchComments(blog.id, commentPage, 10);
                }}
              />
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCommentPage(page)}
                className={page === commentPage ? 'active' : ''}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
