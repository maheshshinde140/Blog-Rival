import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '@/database/schemas/blog.schema';
import { User } from '@/database/schemas/user.schema';
import { CreateBlogDto, UpdateBlogDto } from './dtos/blog.dto';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@/common/exceptions/api.exception';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createBlogDto: CreateBlogDto, userId: string): Promise<Blog> {
    const slug = this.generateSlug(createBlogDto.title);

    const existingBlog = await this.blogModel.findOne({ slug });
    if (existingBlog) {
      throw new ConflictException('A blog with this title already exists');
    }

    const blog = new this.blogModel({
      ...createBlogDto,
      slug,
      userId,
    });

    return blog.save();
  }

  async findAll(pagination: PaginationDto) {
    const [blogs, total] = await Promise.all([
      this.blogModel
        .find({ isPublished: true })
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.blogModel.countDocuments({ isPublished: true }),
    ]);

    return {
      data: blogs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOne({ slug, isPublished: true })
      .populate('userId', 'firstName lastName')
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findById(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async findUserBlogs(userId: string, pagination: PaginationDto) {
    const [blogs, total] = await Promise.all([
      this.blogModel
        .find({ userId })
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.blogModel.countDocuments({ userId }),
    ]);

    return {
      data: blogs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, userId: string): Promise<Blog> {
    const blog = await this.findById(id);

    if (blog.userId.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own blogs');
    }

    let finalUpdateDto: UpdateBlogDto & { slug?: string } = { ...updateBlogDto };

    if (updateBlogDto.title && updateBlogDto.title !== blog.title) {
      const newSlug = this.generateSlug(updateBlogDto.title);
      const existingBlog = await this.blogModel.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBlog) {
        throw new ConflictException('A blog with this title already exists');
      }
      finalUpdateDto = { ...finalUpdateDto, slug: newSlug };
    }

    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, finalUpdateDto, {
      new: true,
    });

    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }

    return updatedBlog;
  }

  async delete(id: string, userId: string): Promise<void> {
    const blog = await this.findById(id);

    if (blog.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    await this.blogModel.findByIdAndDelete(id);
  }

  async incrementLikeCount(blogId: string): Promise<void> {
    await this.blogModel.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } }, { new: true });
  }

  async decrementLikeCount(blogId: string): Promise<void> {
    await this.blogModel.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } }, { new: true });
  }

  async incrementCommentCount(blogId: string): Promise<void> {
    await this.blogModel.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } }, { new: true });
  }

  async decrementCommentCount(blogId: string): Promise<void> {
    await this.blogModel.findByIdAndUpdate(blogId, { $inc: { commentCount: -1 } }, { new: true });
  }

  async updateFeaturedImage(blogId: string, userId: string, file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const blog = await this.findById(blogId);
    if (blog.userId.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own blogs');
    }

    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const updated = await this.blogModel.findByIdAndUpdate(
      blogId,
      { $set: { featuredImage: dataUri } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Blog not found');
    }

    return {
      featuredImage: updated.featuredImage || '',
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
}
