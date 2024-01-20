import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { SCHOOL_API_COOKIE_SESSION__KEY } from '../../config/school-api';
import { Cookie } from 'tough-cookie';
import { FindStayOutReqListReqDto } from './dto/request/find-stay-out-req-list-req.dto';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';

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
    });

    // 쿠키로 사용자 정보 조회
    const userInfo = await this.schoolHttpClientService.findUserInfo(
      this.httpService.axiosRef,
      cookie,
    );

    // const schoolFindStayOutReqListReqDto = SchoolFindStayOutRequestsReqDto.of(
    //   dto.year,
    //   dto.semester,
    //   // TODO: name 추가할 경우 삽입
    //   dto.name,
    // );

    // this.schoolHttpClientService.findStayOutRequests(
    //   this.httpService.axiosRef,
    //   dto,
    // );
    return { message: '테스트 성공', userInfo };
  }
}
