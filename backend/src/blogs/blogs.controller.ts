import {
  BadRequestException as NestBadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dtos/blog.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  // Public endpoints
  @Get('public/feed')
  async getPublicFeed(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const pagination = new PaginationDto(pageNum, limitNum);
    const result = await this.blogsService.findAll(pagination);

    return {
      data: (result.data || []).map((blog: any) => {
        const blogObj = blog.toObject ? blog.toObject() : blog;
        return {
          id: blogObj._id,
          title: blogObj.title,
          slug: blogObj.slug,
          summary: blogObj.summary,
          featuredImage: blogObj.featuredImage,
          author: {
            id: blogObj.userId?._id || '',
            firstName: blogObj.userId?.firstName || '',
            lastName: blogObj.userId?.lastName || '',
            profileImage: blogObj.userId?.profileImage || '',
          },
          likeCount: blogObj.likeCount,
          commentCount: blogObj.commentCount,
          createdAt: blogObj.createdAt,
        };
      }),
      pagination: result.pagination,
    };
  }

  @Get('public/:slug')
  async getPublicBlogBySlug(@Param('slug') slug: string) {
    const blog = await this.blogsService.findBySlug(slug);
    const blogObj = blog.toObject ? blog.toObject() : blog;
    return {
      id: blogObj._id,
      title: blogObj.title,
      slug: blogObj.slug,
      content: blogObj.content,
      summary: blogObj.summary,
      featuredImage: blogObj.featuredImage,
      author: {
        id: (blogObj.userId as any)?._id,
        firstName: (blogObj.userId as any)?.firstName,
        lastName: (blogObj.userId as any)?.lastName,
        profileImage: (blogObj.userId as any)?.profileImage || '',
      },
      likeCount: blogObj.likeCount,
      commentCount: blogObj.commentCount,
      createdAt: blogObj.createdAt,
    };
  }

  // Protected endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  async createBlog(@Body() createBlogDto: CreateBlogDto, @Request() req: any) {
    return this.blogsService.create(createBlogDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const pagination = new PaginationDto(pageNum, limitNum);
    return this.blogsService.findUserBlogs(req.user.userId, pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBlog(@Param('id') id: string) {
    return this.blogsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req: any,
  ) {
    return this.blogsService.update(id, updateBlogDto, req.user.userId);
  }

  @Post(':id/featured-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async uploadFeaturedImage(
    @Param('id') id: string,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new NestBadRequestException('Image file is required');
    }
    return this.blogsService.updateFeaturedImage(id, req.user.userId, file);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteBlog(@Param('id') id: string, @Request() req: any) {
    await this.blogsService.delete(id, req.user.userId);
  }
}
