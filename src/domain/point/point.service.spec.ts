import { HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { Test } from '@nestjs/testing';
import axios from 'axios';
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
    it('유효하지 않은 년도의 상벌점 내역 조회 요청 시, 빈 배열을 반환한다.', async () => {
      // given
      httpService.axiosRef.defaults.jar = new CookieJar();
      const cookie = await schoolHttpClientService.login(
        httpService.axiosRef,
        SchoolLoginReqDto.of(process.env.LOGIN_ID, process.env.LOGIN_PASSWORD),
      );

      const dto = new FindPointListReqDto();
      dto.cookies = cookie;
      dto.semester = '2';
      dto.year = '2000';

      // when
      const res = await pointService.findPointList(dto);
      expect(res.date).toEqual([]);
      expect(res.content).toEqual([]);
      expect(res.score).toEqual([]);
      expect(res.scoreType).toEqual([]);
    }, 10000);
  });
});
