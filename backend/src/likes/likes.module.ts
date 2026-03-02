import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '@/database/schemas/like.schema';
import { Blog, BlogSchema } from '@/database/schemas/blog.schema';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { BlogsModule } from '@/blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    BlogsModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
