import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  profileImage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}
