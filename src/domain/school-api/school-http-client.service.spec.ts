import { SchoolHttpClientService } from './school-http-client.service';
import { Test } from '@nestjs/testing';
import {
  AuthFailedException,
  InternalServerException,
} from '../../global/error/exception/base.exception';
import axios from 'axios';
import {
  PointExceptionCode,
  UserExceptionCode,
} from '../../global/error/exception-code';
import { SchoolFindDormitoryRewardsReqDto } from './dto/request/school-find-dormitory-rewards-req.dto';
import {
  SCHOOL_API_COOKIE_SESSION_KEY,
  SCHOOL_URL,
} from '../../config/school-api';
import { Cookie, CookieJar } from 'tough-cookie';
import { SchoolLoginReqDto } from './dto/request/school-login-req.dto';

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

  describe('로그인', () => {
    it('틀린 아이디를 입력하면 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });
      axiosInstance.defaults.jar = new CookieJar();

      const dto = SchoolLoginReqDto.of(
        process.env.LOGIN_ID + '1',
        process.env.LOGIN_PASSWORD,
      );

      // when
      try {
        await schoolHttpClientService.login(axiosInstance, dto);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(AuthFailedException);
      }
    }, 10000);

    it('틀린 비밀번호를 입력하면 예외가 발생한다', async () => {
      // given
      const axiosInstance = axios.create({
        maxRedirects: 10,
        withCredentials: true,
      });
      axiosInstance.defaults.jar = new CookieJar();

      const dto = SchoolLoginReqDto.of(
        process.env.LOGIN_ID,
        process.env.LOGIN_PASSWORD + '1',
      );

      // when
      try {
        await schoolHttpClientService.login(axiosInstance, dto);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(AuthFailedException);
      }
    }, 10000);
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
        await schoolHttpClientService.findUserInfo(axiosInstance, new Cookie());
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
        await schoolHttpClientService.findYearAndSemester(
          axiosInstance,
          new Cookie(),
        );
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
        SchoolFindDormitoryRewardsReqDto.of(
          '2023',
          '1',
          process.env.LOGIN_ID,
          process.env.NAME,
        );

      // when
      try {
        await schoolHttpClientService.findDormitoryRewards(
          axiosInstance,
          schoolFindDormitoryStudentInfoReqDto,
          new Cookie(),
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
        key: SCHOOL_API_COOKIE_SESSION_KEY,
        value: 'cookie',
      });
      axiosInstance.defaults.jar = new CookieJar();
      axiosInstance.defaults.jar.setCookie(cookie, SCHOOL_URL);

      const schoolFindDormitoryStudentInfoReqDto =
        SchoolFindDormitoryRewardsReqDto.of(
          '2023',
          '1',
          process.env.LOGIN_ID,
          process.env.NAME,
        );

      // when
      try {
        await schoolHttpClientService.findDormitoryRewards(
          axiosInstance,
          schoolFindDormitoryStudentInfoReqDto,
          new Cookie({ key: SCHOOL_API_COOKIE_SESSION_KEY, value: 'cookie' }),
        );
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(InternalServerException);
        expect(e.errorCode).toEqual(PointExceptionCode.FIND_POINT_LIST_FAILED);
      }
    }, 10000);
  });
});
