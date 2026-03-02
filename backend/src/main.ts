import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

export async function createApp(adapter?: ExpressAdapter) {
  const app = adapter
    ? await NestFactory.create(AppModule, adapter)
    : await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '');
  const allowedOrigins = corsOrigin
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  });

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT', 3001));
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on http://0.0.0.0:${port}`);
}

if (require.main === module) {
  bootstrap();
}
