import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Blog } from './blog.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId!: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blogId!: Blog;

  @Prop({ required: true })
  content!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ blogId: 1 });
CommentSchema.index({ blogId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1 });
