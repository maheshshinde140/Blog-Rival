'use client';

import { Comment as CommentType } from '@/types';
import { formatDate, getAuthorName } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentType;
  isOwner?: boolean;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, isOwner = false, onDelete }: CommentItemProps) {
  return (
    <article className="card">
      <div style={{ marginBottom: '0.6rem' }}>
        <strong>{getAuthorName(comment.author.firstName, comment.author.lastName)}</strong>
        <span className="muted" style={{ marginLeft: '0.55rem', fontSize: '0.9rem' }}>
          {formatDate(comment.createdAt)}
        </span>
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
