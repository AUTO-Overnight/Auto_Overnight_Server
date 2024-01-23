import { Injectable } from '@nestjs/common';
import { LoginReqDto } from './dto/request/login-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { HttpService } from '@nestjs/axios';
import { SchoolLoginReqDto } from '../school-api/dto/request/school-login-req.dto';
import { Cookie } from 'tough-cookie';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { SCHOOL_API_COOKIE_SESSION_KEY } from '../../config/school-api';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly schoolHttpClientService: SchoolHttpClientService,
  ) {
    axiosCookieJarSupport(this.httpService.axiosRef);
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    const loginRequestDto = SchoolLoginReqDto.of(dto.id, dto.password);
    // 로그인
    const cookies = await this.schoolHttpClientService.login(
      this.httpService.axiosRef,
      loginRequestDto,
    );

    // 쿠키 설정
    const requestCookie = new Cookie({
      key: SCHOOL_API_COOKIE_SESSION_KEY,
      value: cookies,
      secure: true,
      httpOnly: true,
    });

    // 학생 정보와 학기 정보 얻기
    const schoolFindUsernameResDto =
      await this.schoolHttpClientService.findUserInfo(
        this.httpService.axiosRef,
        requestCookie,
      );

    const schoolFindSemesterResDto =
      await this.schoolHttpClientService.findYearAndSemester(
        this.httpService.axiosRef,
        requestCookie,
      );

    // TODO: 외박 신청내역 조회하기

    return LoginResDto.of(
      cookies,
      schoolFindUsernameResDto.username,
      schoolFindSemesterResDto.semester,
      schoolFindSemesterResDto.year,
    );
  }
}
