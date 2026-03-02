import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '@/database/schemas/blog.schema';
import { User, UserSchema } from '@/database/schemas/user.schema';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [BlogsService],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
