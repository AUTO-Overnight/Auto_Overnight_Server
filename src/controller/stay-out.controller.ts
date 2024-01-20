import { Body, Controller, Get } from '@nestjs/common';
import { StayOutService } from '../domain/stay-out/stay-out.service';
import { FindStayOutReqListReqDto } from '../domain/stay-out/dto/request/find-stay-out-req-list-req.dto';

@Controller('/api/v1/stay-out')
export class StayOutController {
  constructor(private readonly stayOutService: StayOutService) {}
  @Get()
  async findStayOutReqList(
    @Body() dto: FindStayOutReqListReqDto,
  ): Promise<any> {
    await this.stayOutService.findStayOutReqList(dto);
  }
}
