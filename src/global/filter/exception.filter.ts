import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  BaseException,
  UnCatchedException,
} from '../error/exception/base.exception';
import { CustomLogger } from '../../infra/logging/custom-logger';
import { ValidationException } from '../error/exception/validation.exception';

@Catch(ValidationException) // validation Exception 캐치
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: ValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: exception.statusCode,
      errorCode: exception.errorCode,
      errors: exception.errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      }),
      timestamp: new Date(),
      path: request.url,
    });
  }
}

@Catch() // 모든 Exception 캐치
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let res;
    if (exception instanceof BaseException) {
      res = exception;
    } else {
      this.logger.debug(exception); // 핸들링되지 않은 익셉션
      res = new UnCatchedException();
    }

    response.status(res.statusCode).json({
      errorCode: res.errorCode,
      statusCode: res.statusCode,
      message: res.message,
      timestamp: new Date(),
      path: request.url,
    });
  }
}
