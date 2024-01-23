import { Body, Controller, Get } from '@nestjs/common';
import { StayOutService } from '../domain/stay-out/stay-out.service';
import { FindStayoutApplyListReqDto } from '../domain/stay-out/dto/request/find-stayout-apply-list-req.dto';
import { SchoolFindStayoutApplyListResDto } from '../domain/school-api/dto/response/school-find-stayout-apply-list-res.dto';

@Controller('/api/v1/stay-out')
export class StayOutController {
  constructor(private readonly stayOutService: StayOutService) {}
  @Get()
  async findStayOutReqList(
    @Body() dto: FindStayoutApplyListReqDto,
  ): Promise<SchoolFindStayoutApplyListResDto> {
    return await this.stayOutService.findStayOutApplyList(dto);
  }
}
