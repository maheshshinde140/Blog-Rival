import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/user.dto';
import { BadRequestException } from '@/common/exceptions/api.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('me/profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async uploadProfileImage(@Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.usersService.updateProfileImage(req.user.userId, file);
  }
}
