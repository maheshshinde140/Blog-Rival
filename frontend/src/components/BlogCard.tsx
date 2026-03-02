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
  const authorName = getAuthorName(authorFirstName, authorLastName);
  const initials = `${authorFirstName?.[0] || ''}${authorLastName?.[0] || ''}`.toUpperCase() || 'BR';
  const authorTag = `${authorFirstName || ''}${authorLastName || ''}`.toLowerCase() || 'blogrival-member';

  return (
    <article className="card feed-card feed-post-card">
      <div className="feed-post-header">
        {blog.author?.profileImage ? (
          <Image
            src={blog.author.profileImage}
            alt={authorName}
            className="feed-post-avatar-image"
            width={84}
            height={84}
            unoptimized
          />
        ) : (
          <div className="feed-post-avatar">{initials}</div>
        )}
        <div className="feed-post-author">
          <div className="feed-post-author-row">
            <p className="feed-post-name">{authorName}</p>
            <span className="feed-post-badge">Public</span>
          </div>
          <p className="feed-post-date">@{authorTag} | {formatDate(blog.createdAt)}</p>
        </div>
      </div>

      <h3 className="card-title feed-card-title">{blog.title}</h3>
      {blog.featuredImage && (
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          className="blog-image feed-post-image"
          width={1200}
          height={675}
          unoptimized
        />
      )}
      <p className="feed-card-summary">{truncateText(blog.summary || 'No summary available yet.', 230)}</p>

      <div className="feed-post-engagement">
        <span>{blog.likeCount} likes</span>
        <span>{blog.commentCount} comments</span>
      </div>

      <div className="btn-group feed-card-actions">
        <Link href={`/blog/${blog.slug}`} className="btn btn-primary">
          Read Story
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

