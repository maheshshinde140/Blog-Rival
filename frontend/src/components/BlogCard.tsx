'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FeedBlog } from '@/types';
import { formatDate, getAuthorName, truncateText } from '@/lib/utils';

interface BlogCardProps {
  blog: FeedBlog;
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BlogCard({ blog, isOwner = false, onEdit, onDelete }: BlogCardProps) {
  const authorFirstName = blog.author?.firstName;
  const authorLastName = blog.author?.lastName;

  return (
    <article className="card">
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
      <h3 className="card-title">{blog.title}</h3>
      <p className="muted">
        By {getAuthorName(authorFirstName, authorLastName)} | {formatDate(blog.createdAt)}
      </p>
      <p style={{ marginTop: '0.85rem' }}>{truncateText(blog.summary || '', 150)}</p>

      <div className="stat-row">
        <span className="pill">{blog.likeCount} likes</span>
        <span className="pill">{blog.commentCount} comments</span>
      </div>

      <div className="btn-group" style={{ marginTop: '1rem' }}>
        <Link href={`/blog/${blog.slug}`} className="btn btn-primary">
          Read More
        </Link>
        {isOwner && (
          <>
            <button onClick={() => onEdit?.(blog.id)} className="btn btn-secondary">
              Edit
            </button>
            <button onClick={() => onDelete?.(blog.id)} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
