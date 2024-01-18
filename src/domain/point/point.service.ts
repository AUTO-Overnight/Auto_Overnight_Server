import { Injectable } from '@nestjs/common';
import { FindPointListReqDto } from './dto/request/find-point-list-req.dto';
import { SchoolFindDormitoryStudentInfoReqDto } from '../school-api/dto/request/school-find-dormitory-student-info-req.dto';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { HttpService } from '@nestjs/axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { Cookie, CookieJar } from 'tough-cookie';
import {
  SCHOOL_API_COOKIE_SESSION__KEY,
  SCHOOL_URL,
} from '../../config/school-api';
import { SchoolFindDormitoryStudentInfoResDto } from '../school-api/dto/response/school-find-dormitory-student-info-res.dto';
import { AuthFailedException } from '../../global/error/exception/base.exception';
import { AuthExceptionCode } from '../../global/error/exception-code';

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
    const cookie = new Cookie({
      key: SCHOOL_API_COOKIE_SESSION__KEY,
      value: dto.cookies,
    });
    this.httpService.axiosRef.defaults.jar = new CookieJar();
    this.httpService.axiosRef.defaults.jar.setCookie(cookie, SCHOOL_URL);

    // 학번 조회
    const findUsernameResDto = await this.schoolHttpClientService.findUserName(
      this.httpService.axiosRef,
    );

    // request의 사용자 이름과 쿠키의 사용자 이름이 일치하지 않는 경우 예외 발생
    if (findUsernameResDto.username != dto.name) {
      throw new AuthFailedException(
        AuthExceptionCode.PROVIDED_USERNAME_AND_COOKIE_DO_NOT_MATCH,
      );
    }

    // 상벌점 내역 조회 시 필요한 dto 생성
    const schoolFindDormitoryStudentInfoReqDto =
      SchoolFindDormitoryStudentInfoReqDto.of(
        dto.year,
        dto.semester,
        findUsernameResDto.userStudentId,
        dto.name,
      );

    // 상벌점 내역 조회
    return this.schoolHttpClientService.findDormitoryStudentInfo(
      this.httpService.axiosRef,
      schoolFindDormitoryStudentInfoReqDto,
    );
  }
}
