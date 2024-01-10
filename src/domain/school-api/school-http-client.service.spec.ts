import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { Test } from '@nestjs/testing';
import { InternalServerException } from '../../global/error/exception/base.exception';
import axios from 'axios';
import { UserExceptionCode } from '../../global/error/exception-code';

describe('SchoolHttpClientService', () => {
  let schoolHttpClientService: SchoolHttpClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SchoolHttpClientService],
    }).compile();

    schoolHttpClientService = moduleRef.get<SchoolHttpClientService>(
      SchoolHttpClientService,
    );
  });

  describe('유저 정보 조회', () => {
    it('쿠키가 없을 경우, 유저 정보 조회 시 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });

      // when
      try {
        await schoolHttpClientService.findUserName(axiosInstance);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(InternalServerException);
        expect(e.errorCode).toEqual(UserExceptionCode.FIND_USER_INFO_FAILED);
      }
    }, 10000);
  });

  describe('유저 재학 정보 조회', () => {
    it('쿠키가 없을 경우, 유저 재학 정보 조회 시 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });

      // when
      try {
        await schoolHttpClientService.findYearAndSemester(axiosInstance);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(InternalServerException);
        expect(e.errorCode).toEqual(UserExceptionCode.FIND_USER_INFO_FAILED);
      }
    }, 10000);
  });
});
