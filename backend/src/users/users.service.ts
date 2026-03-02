import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '@/database/schemas/user.schema';
import { CreateUserDto } from '@/common/dtos/auth.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@/common/exceptions/api.exception';
import { UpdateProfileDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = new this.userModel({
      ...createUserDto,
      passwordHash,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailOptional(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: expiresAt,
      },
    });
  }

  async findByPasswordResetToken(tokenHash: string): Promise<User | null> {
    return this.userModel.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { passwordHash },
      $unset: {
        resetPasswordTokenHash: 1,
        resetPasswordExpiresAt: 1,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const finalUpdate: UpdateProfileDto = { ...updateProfileDto };

    if (finalUpdate.email) {
      const normalizedEmail = finalUpdate.email.toLowerCase().trim();
      const existingUser = await this.userModel.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      finalUpdate.email = normalizedEmail;
    }

    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: finalUpdate },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return {
      id: updated._id.toString(),
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      profileImage: updated.profileImage || '',
      bio: updated.bio || '',
      location: updated.location || '',
      website: updated.website || '',
      role: updated.role,
      createdAt: updated.createdAt,
    };
  }

  async updateProfileImage(userId: string, file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { profileImage: dataUri } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return {
      profileImage: updated.profileImage || '',
    };
  }
}
