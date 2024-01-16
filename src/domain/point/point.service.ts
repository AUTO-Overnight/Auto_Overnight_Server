import { Injectable } from '@nestjs/common';
import { FindPointListReqDto } from './dto/request/find-point-list-req.dto';
import { SchoolFindDormitoryStudentInfoReqDto } from '../school-api/dto/request/school-find-dormitory-student-info-req.dto';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { HttpService } from '@nestjs/axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { Cookie, CookieJar } from 'tough-cookie';
import { SCHOOL_URL } from '../../config/school-api';
import { SchoolFindDormitoryStudentInfoResDto } from '../school-api/dto/response/school-find-dormitory-student-info-res.dto';

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
  ): Promise<SchoolFindDormitoryStudentInfoResDto> {
    // cookie 설정
    const cookie = new Cookie({ key: 'JSVSESSIONID', value: dto.cookies });
    this.httpService.axiosRef.defaults.jar = new CookieJar();
    this.httpService.axiosRef.defaults.jar.setCookie(cookie, SCHOOL_URL);

    // 학번 조회
    const findUsernameResDto = await this.schoolHttpClientService.findUserName(
      this.httpService.axiosRef,
    );

    const schoolFindDormitoryStudentInfoReqDto =
      SchoolFindDormitoryStudentInfoReqDto.of(
        dto.year,
        dto.semester,
        findUsernameResDto.userStudentId,
        dto.name,
      );

    return this.schoolHttpClientService.findDormitoryStudentInfo(
      this.httpService.axiosRef,
      schoolFindDormitoryStudentInfoReqDto,
    );
  }
}
