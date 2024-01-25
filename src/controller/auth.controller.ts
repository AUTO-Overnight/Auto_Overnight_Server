import { Body, Controller, Post } from '@nestjs/common';
import { LoginResDto } from '../domain/auth/dto/response/login-res.dto';
import { LoginReqDto } from '../domain/auth/dto/request/login-req.dto';
import { AuthService } from '../domain/auth/auth.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(dto);
  }
}
