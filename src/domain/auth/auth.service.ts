import { Injectable } from '@nestjs/common';
import { LoginReqDto } from './dto/request/login-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { HttpService } from '@nestjs/axios';
import { schoolUrl } from '../../config';
import { wrapper as axiosCookieJarSurpport } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { findYYtmgbnXML } from '../../model/school-request/xmls';
import { SchoolLoginReqDto } from '../../model/school-request/school-login-req.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService, private readonly userService: UserService) {
    axiosCookieJarSurpport(this.httpService.axiosRef);
    this.httpService.axiosRef.defaults.jar = new CookieJar();
    this.httpService.axiosRef.defaults.headers.get['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    this.httpService.axiosRef.defaults.headers.post['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    this.httpService.axiosRef.defaults.withCredentials = true;
    this.httpService.axiosRef.defaults.maxRedirects = 10;
  }

  async login(dto: LoginReqDto):Promise<LoginResDto> {
    await this.loginForSchool(dto);
    const base64encode = Buffer.from(dto.id, 'utf8').toString('base64');

    const loginForSchoolResponse = await this.httpService.axiosRef.get(schoolUrl.SESSION + base64encode);
    const cookies = loginForSchoolResponse.request._headers.cookie;

    const schoolFindUsernameResDto= await this.userService.findUserName(this.httpService.axiosRef);
    const schoolFindSemesterResDto = await this.userService.findYearAndSemester(this.httpService.axiosRef);

    return LoginResDto.of(cookies, schoolFindUsernameResDto.username, schoolFindSemesterResDto.semester, schoolFindSemesterResDto.year);
  }

  async loginForSchool(dto: LoginReqDto) {
    const loginRequestDto = SchoolLoginReqDto.of(dto.id, dto.password);
    const header = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    await this.httpService.axiosRef.post(schoolUrl.LOGIN, loginRequestDto, header);
  }
}
