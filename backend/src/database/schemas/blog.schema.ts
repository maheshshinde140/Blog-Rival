import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId!: User;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug!: string;

  @Prop({ required: true })
  content!: string;

  @Prop()
  summary?: string;

  @Prop({ default: false })
  isPublished!: boolean;

  @Prop({ default: 0 })
  likeCount!: number;

  @Prop({ default: 0 })
  commentCount!: number;

  @Prop()
  featuredImage?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ userId: 1 });
BlogSchema.index({ isPublished: 1, createdAt: -1 });
