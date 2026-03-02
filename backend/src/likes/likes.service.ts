import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '@/database/schemas/like.schema';
import { Blog } from '@/database/schemas/blog.schema';
import { BlogsService } from '@/blogs/blogs.service';
import { ConflictException, NotFoundException } from '@/common/exceptions/api.exception';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private blogsService: BlogsService,
  ) {}

  async addLike(blogId: string, userId: string): Promise<{ likeCount: number }> {
    // Check if blog exists
    const blog = await this.blogsService.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if user already liked this blog
    const existingLike = await this.likeModel.findOne({ blogId, userId });
    if (existingLike) {
      throw new ConflictException('You have already liked this blog');
    }

    // Create like
    const like = new this.likeModel({ blogId, userId });
    await like.save();

    // Increment like count
    await this.blogsService.incrementLikeCount(blogId);

    const updatedBlog = await this.blogModel.findById(blogId);
    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return { likeCount: updatedBlog.likeCount };
  }

  async removeLike(blogId: string, userId: string): Promise<{ likeCount: number }> {
    const like = await this.likeModel.findOne({ blogId, userId });
    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeModel.deleteOne({ _id: like._id });

    // Decrement like count
    await this.blogsService.decrementLikeCount(blogId);

    const updatedBlog = await this.blogModel.findById(blogId);
    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return { likeCount: updatedBlog.likeCount };
  }

  async getLikeCount(blogId: string): Promise<number> {
    const count = await this.likeModel.countDocuments({ blogId });
    return count;
  }

  async hasUserLiked(blogId: string, userId: string): Promise<boolean> {
    const like = await this.likeModel.findOne({ blogId, userId });
    return !!like;
  }
}
