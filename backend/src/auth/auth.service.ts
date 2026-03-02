import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { UsersService } from '@/users/users.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from '@/common/dtos/auth.dto';
import { BadRequestException, UnauthorizedException } from '@/common/exceptions/api.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      },
    };
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmailOptional(forgotPasswordDto.email);

    if (!user) {
      return {
        message: 'If an account with that email exists, a reset link has been generated.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.setPasswordResetToken(user._id.toString(), resetTokenHash, expiresAt);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    return {
      message: 'Password reset link generated.',
      ...(isProduction
        ? {}
        : {
            // No email provider is configured in this project, so token is returned for local flow.
            resetToken,
            expiresAt: expiresAt.toISOString(),
          }),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenHash = createHash('sha256').update(resetPasswordDto.token).digest('hex');
    const user = await this.usersService.findByPasswordResetToken(tokenHash);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.usersService.updatePassword(user._id.toString(), resetPasswordDto.password);

    return {
      message: 'Password reset successfully',
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
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
    };
  }

  private generateAccessToken(user: any): string {
    return this.jwtService.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRE', '24h'),
      },
    );
  }

  private generateRefreshToken(user: any): string {
    return this.jwtService.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRE', '7d'),
      },
    );
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
