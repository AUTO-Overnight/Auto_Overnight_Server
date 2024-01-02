import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PointController } from './controller/point.controller';
import { StayOutController } from './controller/stay-out.controller';
import { LoggingModule } from './infra/logging/logging.module';
import { GlobalExceptionFilter } from './global/filter/exception.filter';

@Module({
  imports: [LoggingModule],
  controllers: [AuthController, PointController, StayOutController],
  providers: [
    {
      provide: 'GLOBAL_EXCEPTION_FILTER',
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
