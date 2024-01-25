import { PointService } from './point.service';
import { Module } from '@nestjs/common';
import { SchoolApiModule } from '../school-api/school-api.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 10,
      withCredentials: true,
    }),
    SchoolApiModule,
  ],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
