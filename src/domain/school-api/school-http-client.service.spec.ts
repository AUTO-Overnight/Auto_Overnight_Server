import { SchoolHttpClientService } from './school-http-client.service';
import { Test } from '@nestjs/testing';
import { InternalServerException } from '../../global/error/exception/base.exception';
import axios from 'axios';
import {
  PointExceptionCode,
  UserExceptionCode,
} from '../../global/error/exception-code';
import { SchoolFindDormitoryStudentInfoReqDto } from './dto/request/school-find-dormitory-student-info-req.dto';
import {
  SCHOOL_API_COOKIE_SESSION__KEY,
  SCHOOL_URL,
} from '../../config/school-api';
import { Cookie, CookieJar } from 'tough-cookie';

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

  describe('상벌점 내역 조회', () => {
    it('쿠키가 없을 경우, 상벌점 내역 조회 시 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });

      const schoolFindDormitoryStudentInfoReqDto =
        SchoolFindDormitoryStudentInfoReqDto.of(
          '2023',
          '1',
          process.env.LOGIN_ID,
          process.env.NAME,
        );

      // when
      try {
        await schoolHttpClientService.findDormitoryStudentInfo(
          axiosInstance,
          schoolFindDormitoryStudentInfoReqDto,
        );
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(InternalServerException);
        expect(e.errorCode).toEqual(PointExceptionCode.FIND_POINT_LIST_FAILED);
      }
    }, 10000);

    it('올바르지 않은 쿠키로 요청할 경우, 상벌점 내역 조회 시 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });
      const cookie = new Cookie({
        key: SCHOOL_API_COOKIE_SESSION__KEY,
        value: 'cookie',
      });
      axiosInstance.defaults.jar = new CookieJar();
      axiosInstance.defaults.jar.setCookie(cookie, SCHOOL_URL);

      const schoolFindDormitoryStudentInfoReqDto =
        SchoolFindDormitoryStudentInfoReqDto.of(
          '2023',
          '1',
          process.env.LOGIN_ID,
          process.env.NAME,
        );

      // when
      try {
        await schoolHttpClientService.findDormitoryStudentInfo(
          axiosInstance,
          schoolFindDormitoryStudentInfoReqDto,
        );
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(InternalServerException);
        expect(e.errorCode).toEqual(PointExceptionCode.FIND_POINT_LIST_FAILED);
      }
    }, 10000);
  });
});
