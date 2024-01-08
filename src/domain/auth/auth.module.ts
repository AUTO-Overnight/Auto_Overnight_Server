import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule.register({}), UserModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
