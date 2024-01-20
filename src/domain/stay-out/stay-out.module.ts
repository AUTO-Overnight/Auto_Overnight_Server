import { Module } from '@nestjs/common';
import { SchoolApiModule } from '../school-api/school-api.module';
import { HttpModule } from '@nestjs/axios';
import { StayOutService } from './stay-out.service';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 10,
      timeout: 50000, //TODO 확인
      withCredentials: true,
    }),
    SchoolApiModule,
  ],
  providers: [StayOutService],
  exports: [StayOutService],
})
export class StayOutModule {}
