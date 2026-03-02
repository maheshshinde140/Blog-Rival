import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ default: 'user' })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  profileImage?: string;

  @Prop()
  bio?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop()
  resetPasswordTokenHash?: string;

  @Prop()
  resetPasswordExpiresAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
