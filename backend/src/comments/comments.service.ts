import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '@/database/schemas/comment.schema';
import { Blog } from '@/database/schemas/blog.schema';
import { BlogsService } from '@/blogs/blogs.service';
import { NotFoundException, ForbiddenException } from '@/common/exceptions/api.exception';
import { CreateCommentDto } from './dtos/comment.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private blogsService: BlogsService,
  ) {}

  async createComment(blogId: string, userId: string, createCommentDto: CreateCommentDto) {
    // Check if blog exists
    const blog = await this.blogsService.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Create comment
    const comment = new this.commentModel({
      blogId,
      userId,
      content: createCommentDto.content,
    });

    await comment.save();
    await comment.populate('userId', 'firstName lastName');

    // Increment comment count
    await this.blogsService.incrementCommentCount(blogId);

    return {
      id: comment._id,
      content: comment.content,
      author: {
        id: comment.userId?._id,
        firstName: comment.userId?.firstName,
        lastName: comment.userId?.lastName,
      },
      createdAt: comment.createdAt,
    };
  }

  async getComments(blogId: string, pagination: PaginationDto) {
    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ blogId })
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.commentModel.countDocuments({ blogId }),
    ]);

    return {
      data: comments.map(comment => ({
        id: comment._id,
        content: comment.content,
        author: {
          id: comment.userId?._id,
          firstName: comment.userId?.firstName,
          lastName: comment.userId?.lastName,
        },
        createdAt: comment.createdAt,
      })),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const blogId = comment.blogId;
    await this.commentModel.findByIdAndDelete(commentId);

    // Decrement comment count
    await this.blogsService.decrementCommentCount(blogId.toString());
  }
}
