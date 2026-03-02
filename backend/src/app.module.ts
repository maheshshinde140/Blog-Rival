import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/blog-rival',
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
