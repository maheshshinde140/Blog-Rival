import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(5)
  title!: string;

  @IsString()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  featuredImage?: string;
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  featuredImage?: string;
}

export class BlogResponseDto {
  id!: string;
  userId!: string;
  title!: string;
  slug!: string;
  content!: string;
  summary?: string;
  isPublished!: boolean;
  likeCount!: number;
  commentCount!: number;
  featuredImage?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class PublicBlogResponseDto {
  id!: string;
  title!: string;
  slug!: string;
  content!: string;
  summary?: string;
  featuredImage?: string;
  author!: {
    id: string;
    firstName: string;
    lastName: string;
  };
  likeCount!: number;
  commentCount!: number;
  createdAt!: Date;
}

export class FeedBlogDto {
  id!: string;
  title!: string;
  slug!: string;
  summary?: string;
  featuredImage?: string;
  author!: {
    id: string;
    firstName: string;
    lastName: string;
  };
  likeCount!: number;
  commentCount!: number;
  createdAt!: Date;
}
