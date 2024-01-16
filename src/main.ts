import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './infra/logging/custom-logger';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

// env설정
dotenv.config();
const environment = process.env.NODE_ENV;
const envPath =
  environment === 'local'
    ? '../.env-local'
    : environment === 'dev'
      ? '../.env-dev'
      : '../.env-prod';
dotenv.config({ path: path.join(__dirname, envPath) });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors();
  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(app.get('GLOBAL_EXCEPTION_FILTER'));
  await app.listen(process.env.NEST_PORT || 8000);
}
bootstrap();
