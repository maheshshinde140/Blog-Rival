import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/comment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@Controller('blogs/:blogId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async getComments(
    @Param('blogId') blogId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pagination = new PaginationDto(page, limit);
    return this.commentsService.getComments(blogId, pagination);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('blogId') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    return this.commentsService.createComment(blogId, req.user.userId, createCommentDto);
  }

  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('commentId') commentId: string, @Request() req: any) {
    await this.commentsService.deleteComment(commentId, req.user.userId);
  }
}
