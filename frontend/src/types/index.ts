export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface Blog {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPublished: boolean;
  likeCount: number;
  commentCount: number;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface FeedBlog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  featuredImage?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
