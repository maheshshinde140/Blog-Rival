'use client';

import { useState } from 'react';
import { useLikes } from '@/hooks/useLikes';

interface LikeButtonProps {
  blogId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export default function LikeButton({ blogId, initialCount, initialLiked = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const { isLoading, addLike, removeLike } = useLikes();

  const handleLike = async () => {
    if (isLoading) return;

    try {
      if (liked) {
        await removeLike(blogId);
        setCount(c => c - 1);
        setLiked(false);
      } else {
        const response = await addLike(blogId);
        setCount(response.likeCount);
        setLiked(true);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={liked ? 'btn btn-primary' : 'btn btn-secondary'}
    >
      <span>{count}</span>
      <span>{liked ? 'Unlike' : 'Like'}</span>
    </button>
  );
}
