import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PointController } from './controller/point.controller';
import { StayOutController } from './controller/stay-out.controller';
import { LoggingModule } from './infra/logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [AuthController, PointController, StayOutController],
  providers: [],
})
export class AppModule {}
