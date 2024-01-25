import { Injectable } from '@nestjs/common';
import { FindPointListReqDto } from './dto/request/find-point-list-req.dto';
import { SchoolFindDormitoryRewardsReqDto } from '../school-api/dto/request/school-find-dormitory-rewards-req.dto';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { HttpService } from '@nestjs/axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { Cookie } from 'tough-cookie';
import { SCHOOL_API_COOKIE_SESSION_KEY } from '../../config/school-api';
import { SchoolFindDormitoryRewardsResDto } from '../school-api/dto/response/school-find-dormitory-rewards-res.dto';

@Injectable()
export class PointService {
  constructor(
    private readonly schoolHttpClientService: SchoolHttpClientService,
    private readonly httpService: HttpService,
  ) {
    axiosCookieJarSupport(this.httpService.axiosRef);
  }

  async findPointList(
    dto: FindPointListReqDto,
  ): Promise<SchoolFindDormitoryRewardsResDto> {
    // cookie 설정
    const cookie = new Cookie({
      key: SCHOOL_API_COOKIE_SESSION_KEY,
      value: dto.cookies,
      secure: true,
      httpOnly: true,
    });

    // 학번 조회
    const findUsernameResDto = await this.schoolHttpClientService.findUserInfo(
      this.httpService.axiosRef,
      cookie,
    );

    // 상벌점 내역 조회 시 필요한 dto 생성
    const schoolFindDormitoryStudentInfoReqDto =
      SchoolFindDormitoryRewardsReqDto.of(
        dto.year,
        dto.semester,
        findUsernameResDto.userStudentId,
        findUsernameResDto.username,
      );

    // 상벌점 내역 조회
    return this.schoolHttpClientService.findDormitoryRewards(
      this.httpService.axiosRef,
      schoolFindDormitoryStudentInfoReqDto,
      cookie,
    );
  }
}
