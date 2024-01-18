import { HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import { AuthFailedException } from '../../global/error/exception/base.exception';
import { PointService } from './point.service';
import { FindPointListReqDto } from './dto/request/find-point-list-req.dto';
import { CookieJar } from 'tough-cookie';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { SchoolLoginReqDto } from '../school-api/dto/request/school-login-req.dto';

describe('PointService', () => {
  const envPath = '../../../.env-test';
  dotenv.config({ path: path.join(__dirname, envPath) });

  let pointService: PointService;
  let httpService: HttpService;
  let schoolHttpClientService: SchoolHttpClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PointService,
        HttpService,
        SchoolHttpClientService,
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: axios.create({
            maxRedirects: 10,
            withCredentials: true,
          }),
        },
      ],
    }).compile();

    pointService = moduleRef.get<PointService>(PointService);
    schoolHttpClientService = moduleRef.get<SchoolHttpClientService>(
      SchoolHttpClientService,
    );
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  describe('상벌점 내역 조회', () => {
    it('요청한 사용자 이름과 쿠키 정보가 일치하지 않다면 예외가 발생한다', async () => {
      // given
      httpService.axiosRef.defaults.jar = new CookieJar();
      let cookie = '';
      await schoolHttpClientService.login(
        httpService.axiosRef,
        SchoolLoginReqDto.of(process.env.LOGIN_ID, process.env.LOGIN_PASSWORD),
      );
      cookie = await schoolHttpClientService.getSession(
        httpService.axiosRef,
        process.env.LOGIN_ID,
      );

      const dto = new FindPointListReqDto();
      dto.cookies = cookie;
      dto.name = '홍길동';
      dto.semester = '2';
      dto.year = '2021';

      // when
      try {
        await pointService.findPointList(dto);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(AuthFailedException);
      }
    }, 10000);
  });
});
