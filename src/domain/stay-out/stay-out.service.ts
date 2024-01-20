import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { SCHOOL_API_COOKIE_SESSION__KEY } from '../../config/school-api';
import { Cookie } from 'tough-cookie';
import { FindStayOutReqListReqDto } from './dto/request/find-stay-out-req-list-req.dto';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { SchoolFindStayOutRequestsReqDto } from '../school-api/dto/request/school-find-stay-out-requests-req.dto';

@Injectable()
export class StayOutService {
  constructor(
    private readonly schoolHttpClientService: SchoolHttpClientService,
    private readonly httpService: HttpService,
  ) {
    axiosCookieJarSupport(this.httpService.axiosRef);
  }
  async findStayOutReqList(dto: FindStayOutReqListReqDto): Promise<any> {
    const cookie = new Cookie({
      key: SCHOOL_API_COOKIE_SESSION__KEY,
      value: dto.cookies,
      path: '/',
    });

    // 쿠키로 사용자 정보 조회
    const userInfo = await this.schoolHttpClientService.findUserInfo(
      this.httpService.axiosRef,
      cookie,
    );

    // 외박 신청 조회 학교 API를 위한 RequestDto 생성
    const schoolFindStayOutReqListReqDto = SchoolFindStayOutRequestsReqDto.of(
      dto.year,
      dto.semester,
      userInfo.userStudentId,
      userInfo.username,
    );

    // 외박 신청 내역 조회
    await this.schoolHttpClientService.findStayOutRequests(
      this.httpService.axiosRef,
      cookie,
      schoolFindStayOutReqListReqDto,
    );
    return { message: '테스트 성공', userInfo };
  }
}
