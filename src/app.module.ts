import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PointController } from './controller/point.controller';
import { StayOutController } from './controller/stay-out.controller';

@Module({
  imports: [],
  controllers: [AuthController, PointController, StayOutController],
  providers: [],
})
export class AppModule {}
