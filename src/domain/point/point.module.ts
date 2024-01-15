import { PointService } from './point.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
