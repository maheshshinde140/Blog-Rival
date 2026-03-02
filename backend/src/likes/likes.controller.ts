import { Controller, Post, Delete, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('blogs/:blogId/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addLike(@Param('blogId') blogId: string, @Request() req: any) {
    return this.likesService.addLike(blogId, req.user.userId);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async removeLike(@Param('blogId') blogId: string, @Request() req: any) {
    await this.likesService.removeLike(blogId, req.user.userId);
  }
}
