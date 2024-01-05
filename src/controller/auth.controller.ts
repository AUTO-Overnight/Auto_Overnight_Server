import { Controller, Get } from '@nestjs/common';
import { BaseException } from '../global/error/exception/base.exception';
import { GlobalExceptionCode } from '../global/error/exception-code';

@Controller('/api/v1/auth')
export class AuthController {
  constructor() {}

  @Get()
  getHello(): string {
    throw new Error('test');
    return 'Hello World!';
  }
}
