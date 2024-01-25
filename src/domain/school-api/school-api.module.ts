import { Module } from '@nestjs/common';
import { SchoolHttpClientService } from './school-http-client.service';

@Module({
  imports: [],
  providers: [SchoolHttpClientService],
  exports: [SchoolHttpClientService],
})
export class SchoolApiModule {}
