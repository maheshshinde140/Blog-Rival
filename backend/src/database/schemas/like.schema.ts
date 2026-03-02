import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Blog } from './blog.schema';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId!: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
  blogId!: Blog;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
// Prevent duplicate likes
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });
LikeSchema.index({ blogId: 1 });
