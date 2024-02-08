import { Body, Controller, Get } from '@nestjs/common';
import { PointService } from '../domain/point/point.service';
import { FindPointListReqDto } from '../domain/point/dto/request/find-point-list-req.dto';
import { SchoolFindDormitoryRewardsResDto } from '../domain/school-api/dto/response/school-find-dormitory-rewards-res.dto';

@Controller('/api/v1/points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  // CI 테스트용 주석
  @Get()
  async findPointList(
    @Body() dto: FindPointListReqDto,
  ): Promise<SchoolFindDormitoryRewardsResDto> {
    return this.pointService.findPointList(dto);
  }
}
