import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './infra/logging/custom-logger';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './global/error/exception/validation.exception';

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

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 선언한 타입에 맞게 변환
      whitelist: true, // 비선언 필드 제거
      exceptionFactory: (errors) => {
        // Custom Validation Exception
        throw new ValidationException(errors);
      },
    }),
  );

  // 전역 필터 설정
  app.useGlobalFilters(
    app.get('GLOBAL_EXCEPTION_FILTER'),
    app.get('VALIDATION_EXCEPTION_FILTER'),
  );
  await app.listen(process.env.NEST_PORT || 8000);
}

bootstrap();
