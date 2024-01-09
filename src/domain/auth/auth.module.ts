import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { SchoolApiModule } from '../school-api/school-api.module';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 10,
      withCredentials: true,
    }),
    SchoolApiModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
