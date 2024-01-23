import { Test, TestingModule } from '@nestjs/testing';
import { StayOutService } from './stay-out.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { SchoolLoginReqDto } from '../school-api/dto/request/school-login-req.dto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { FindStayoutApplyListReqDto } from './dto/request/find-stayout-apply-list-req.dto';

const envPath = '../../../.env-test';
dotenv.config({ path: path.join(__dirname, envPath) });

describe('StayOutService', () => {
  let stayOutService: StayOutService;
  let httpService: HttpService;
  let schoolHttpClientService: SchoolHttpClientService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StayOutService, SchoolHttpClientService],
    }).compile();

    stayOutService = moduleRef.get<StayOutService>(StayOutService);
    httpService = moduleRef.get<HttpService>(HttpService);
    schoolHttpClientService = moduleRef.get<SchoolHttpClientService>(
      SchoolHttpClientService,
    );
  });

  describe('외박신청내역 조회', () => {
    it('외박신청내역이 있는 경우 외박신청내역 정상적으로 반환', async () => {
      // given : 로그인
      const schoolLoginReqDto = SchoolLoginReqDto.of(
        process.env.LOGIN_ID,
        process.env.LOGIN_PASSWORD,
      );
      const cookie = await schoolHttpClientService.login(
        httpService.axiosRef,
        schoolLoginReqDto,
      );

      // when : 외박신청내역 조회
      const dto = new FindStayoutApplyListReqDto();
      dto.year = '2000';
      dto.semester = '1';
      dto.cookies = cookie;

      const res = await stayOutService.findStayOutApplyList(dto);

      // then : 빈 외박신청내역 반환
      expect(res.stayOutStartDate).toEqual([]);
      expect(res.stayOutEndDate).toEqual([]);
      expect(res.stayOutApproval).toEqual([]);
    });
  });
});
