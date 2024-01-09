import { Injectable } from '@nestjs/common';
import { LoginReqDto } from './dto/request/login-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { HttpService } from '@nestjs/axios';
import {
  schoolLoginRequestHeader,
  schoolRequestUrl,
} from '../../config/school-api';
import { SchoolLoginReqDto } from '../school-api/dto/request/school-login-req.dto';
import { CookieJar } from 'tough-cookie';
import { wrapper as axiosCookieJarSurpport } from 'axios-cookiejar-support';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { AuthFailedException } from '../../global/error/exception/base.exception';
import { AuthExceptionCode } from '../../global/error/exception-code';

@Injectable()
export class AuthService {
  private readonly LOGIN_ERROR_MESSAGE: string = '인증에 실패했습니다';
  constructor(
    private readonly httpService: HttpService,
    private readonly schoolHttpClientService: SchoolHttpClientService,
  ) {
    axiosCookieJarSurpport(this.httpService.axiosRef);
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    this.httpService.axiosRef.defaults.jar = new CookieJar();
    await this.loginForSchool(dto);

    // 통합 정보 시스템에서 세션 얻기
    const base64encode = Buffer.from(dto.id, 'utf8').toString('base64');
    const loginForSchoolResponse = await this.httpService.axiosRef.get(
      schoolRequestUrl.SESSION + base64encode,
    );
    const cookies = loginForSchoolResponse.request._headers.cookie;
    if (cookies == null) {
      throw new AuthFailedException(AuthExceptionCode.AUTH_FAILED);
    }

    // 학생 이름과 학기 정보 얻기
    const schoolFindUsernameResDto =
      await this.schoolHttpClientService.findUserName(
        this.httpService.axiosRef,
      );
    const schoolFindSemesterResDto =
      await this.schoolHttpClientService.findYearAndSemester(
        this.httpService.axiosRef,
      );

    // TODO: 외박 신청내역 조회하기

    return LoginResDto.of(
      cookies,
      schoolFindUsernameResDto.username,
      schoolFindSemesterResDto.semester,
      schoolFindSemesterResDto.year,
    );
  }

  async loginForSchool(dto: LoginReqDto) {
    const loginRequestDto = SchoolLoginReqDto.of(dto.id, dto.password);
    const requestConfig = {
      headers: schoolLoginRequestHeader,
    };

    await this.httpService.axiosRef
      .post(schoolRequestUrl.LOGIN, loginRequestDto, requestConfig)
      .then((res) => {
        if (res.data.toString().includes(this.LOGIN_ERROR_MESSAGE))
          throw new AuthFailedException(AuthExceptionCode.AUTH_FAILED);
      });
  }
}
