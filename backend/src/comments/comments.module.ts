import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '@/database/schemas/comment.schema';
import { Blog, BlogSchema } from '@/database/schemas/blog.schema';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { BlogsModule } from '@/blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    BlogsModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
