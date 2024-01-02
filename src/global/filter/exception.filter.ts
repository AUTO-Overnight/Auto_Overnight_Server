import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  BaseException,
  UnCatchedException,
} from '../error/exception/base.exception';
import { CustomLogger } from '../../infra/logging/custom-logger';

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
