import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { HttpClientModule } from '../../infra/http-client/http-client.module';

@Module({
  imports: [HttpClientModule.registerForSchool({}), UserModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
