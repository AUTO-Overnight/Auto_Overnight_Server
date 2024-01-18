import { Injectable } from '@nestjs/common';
import { LoginReqDto } from './dto/request/login-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { HttpService } from '@nestjs/axios';
import { SchoolLoginReqDto } from '../school-api/dto/request/school-login-req.dto';
import { CookieJar } from 'tough-cookie';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly schoolHttpClientService: SchoolHttpClientService,
  ) {
    axiosCookieJarSupport(this.httpService.axiosRef);
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    this.httpService.axiosRef.defaults.jar = new CookieJar();
    const loginRequestDto = SchoolLoginReqDto.of(dto.id, dto.password);

    // 로그인
    await this.schoolHttpClientService.login(
      this.httpService.axiosRef,
      loginRequestDto,
    );

    // 통합 정보 시스템에서 세션 얻기
    const cookies = await this.schoolHttpClientService.getSession(
      this.httpService.axiosRef,
      dto.id,
    );

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
}
