import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: apply hardened HTTP headers
  app.use(helmet());

  // Parse cookies coming from the client
  app.use(cookieParser());

  // Global DTO validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties without decorators
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true, // Transform payloads into class instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Configure secure CORS defaults
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600, // Cache preflight responses for 1 hour
  });

  // Set a global prefix for every route
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}/api`);
  console.log(
    `🔒 Security features enabled: Helmet, CORS, Rate Limiting, Validation`
  );
}

bootstrap();
