import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
