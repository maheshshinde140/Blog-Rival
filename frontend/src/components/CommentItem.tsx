'use client';

import Image from 'next/image';
import { Comment as CommentType } from '@/types';
import { formatDate, getAuthorName } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentType;
  isOwner?: boolean;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, isOwner = false, onDelete }: CommentItemProps) {
  const name = getAuthorName(comment.author.firstName, comment.author.lastName);
  const initials = `${comment.author.firstName?.[0] || ''}${comment.author.lastName?.[0] || ''}`.toUpperCase() || 'BR';

  return (
    <article className="card">
      <div className="comment-head">
        {comment.author.profileImage ? (
          <Image
            src={comment.author.profileImage}
            alt={name}
            className="comment-avatar-image"
            width={70}
            height={70}
            unoptimized
          />
        ) : (
          <span className="comment-avatar-fallback">{initials}</span>
        )}
        <div>
          <strong>{name}</strong>
          <p className="muted">{formatDate(comment.createdAt)}</p>
        </div>
      </div>
      <p>{comment.content}</p>
      {isOwner && (
        <button onClick={() => onDelete?.(comment.id)} className="btn btn-danger" style={{ marginTop: '0.85rem' }}>
          Delete
        </button>
      )}
    </article>
  );
}
