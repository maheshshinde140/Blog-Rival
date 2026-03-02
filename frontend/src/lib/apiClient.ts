import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blog-rival.onrender.com';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use(config => {
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
              // Clear cookies and redirect to login
              Cookies.remove('accessToken');
              Cookies.remove('refreshToken');
              window.location.href = '/auth/login';
            }
          } catch {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Auth endpoints
  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async requestPasswordReset(email: string) {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data as { message: string; resetToken?: string; expiresAt?: string };
  }

  async resetPassword(token: string, password: string) {
    const response = await this.client.post('/auth/reset-password', { token, password });
    return response.data as { message: string };
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async getMyProfile() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async updateMyProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    location?: string;
    website?: string;
  }) {
    const response = await this.client.patch('/users/me', data);
    return response.data;
  }

  async uploadMyProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await this.client.post('/users/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as { profileImage: string };
  }

  // Blogs endpoints
  async createBlog(data: {
    title: string;
    content: string;
    summary?: string;
    isPublished?: boolean;
    featuredImage?: string;
  }) {
    const response = await this.client.post('/blogs', data);
    return response.data;
  }

  async getUserBlogs(page: number = 1, limit: number = 10) {
    const response = await this.client.get('/blogs', { params: { page, limit } });
    return response.data;
  }

  async getBlogById(id: string) {
    const response = await this.client.get(`/blogs/${id}`);
    return response.data;
  }

  async getPublicFeed(page: number = 1, limit: number = 10) {
    const response = await this.client.get('/blogs/public/feed', { params: { page, limit } });
    return response.data;
  }

  async getPublicBlogBySlug(slug: string) {
    const response = await this.client.get(`/blogs/public/${slug}`);
    return response.data;
  }

  async updateBlog(
    id: string,
    data: {
      title?: string;
      content?: string;
      summary?: string;
      isPublished?: boolean;
      featuredImage?: string;
    },
  ) {
    const response = await this.client.patch(`/blogs/${id}`, data);
    return response.data;
  }

  async uploadBlogFeaturedImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await this.client.post(`/blogs/${id}/featured-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as { featuredImage: string };
  }

  async deleteBlog(id: string) {
    await this.client.delete(`/blogs/${id}`);
  }

  // Likes endpoints
  async addLike(blogId: string) {
    const response = await this.client.post(`/blogs/${blogId}/likes`);
    return response.data;
  }

  async removeLike(blogId: string) {
    await this.client.delete(`/blogs/${blogId}/likes`);
  }

  // Comments endpoints
  async getComments(blogId: string, page: number = 1, limit: number = 10) {
    const response = await this.client.get(`/blogs/${blogId}/comments`, { params: { page, limit } });
    return response.data;
  }

  async createComment(blogId: string, content: string) {
    const response = await this.client.post(`/blogs/${blogId}/comments`, { content });
    return response.data;
  }

  async deleteComment(blogId: string, commentId: string) {
    await this.client.delete(`/blogs/${blogId}/comments/${commentId}`);
  }
}

export const apiClient = new ApiClient();
