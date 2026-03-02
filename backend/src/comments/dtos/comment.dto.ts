import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content!: string;
}

export class CommentResponseDto {
  id!: string;
  content!: string;
  author!: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  createdAt!: Date;
}
