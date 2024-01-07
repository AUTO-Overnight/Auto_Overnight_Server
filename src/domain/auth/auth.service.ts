import { Injectable } from '@nestjs/common';
import { LoginReqDto } from './dto/request/login-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { HttpService } from '@nestjs/axios';
import { SCHOOL_URL, schoolUrl } from '../../config';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { wrapper as axiosCookieJarSurpport } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {
    axiosCookieJarSurpport(this.httpService.axiosRef);
  }

  async login(dto: LoginReqDto):Promise<LoginResDto> {
    if (dto.password =="" || dto.id == "") {
      throw new Error("id or password is empty");
    }

    const loginInfo = {
      internalId: dto.id,
      internalPw: dto.password,
      gubun: "inter",
    };


    const base64encode = Buffer.from(dto.id, 'utf8').toString('base64');
    const cookieJar = new CookieJar();
    this.httpService.axiosRef.defaults.jar = cookieJar;
    this.httpService.axiosRef.defaults.headers.get['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    this.httpService.axiosRef.defaults.headers.post['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';
    this.httpService.axiosRef.defaults.withCredentials = true;
    this.httpService.axiosRef.defaults.maxRedirects = 10;

    const header = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': null },
    };

    const res = await lastValueFrom(this.httpService.post(schoolUrl.LOGIN, loginInfo, header).pipe(
      map(response => response)
    ))

    const loginResDto = new LoginResDto();

    const res2 = await this.httpService.axiosRef.get(schoolUrl.SESSION + base64encode)
      .then((res) => {loginResDto.cookies = res.request._headers.cookie});

    console.log(loginResDto.cookies);
    return null;
  }
}
