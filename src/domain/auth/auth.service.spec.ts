import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { SchoolHttpClientService } from '../school-api/school-http-client.service';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AuthFailedException } from '../../global/error/exception/base.exception';

describe('AuthService', () => {
  let authService: AuthService;
  const envPath = '../../../.env-test';
  dotenv.config({ path: path.join(__dirname, envPath) });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
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

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('로그인', () => {
    it('로그인할 수 있다.', async () => {
      // given
      const dto = {
        id: process.env.LOGIN_ID,
        password: process.env.LOGIN_PASSWORD,
      };

      // when
      const result = await authService.login(dto);

      // then
      expect(result).toBeDefined();
      expect(result.cookies).toBeDefined();
      expect(result.name).toEqual('김하린');
    }, 10000);

    it('틀린 아이디를 입력하면 예외가 발생한다', async () => {
      // given
      const dto = {
        id: process.env.LOGIN_ID + '1',
        password: process.env.LOGIN_PASSWORD,
      };

      // when
      try {
        await authService.loginForSchool(dto);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(AuthFailedException);
      }
    }, 10000);

    it('틀린 비밀번호를 입력하면 예외가 발생한다', async () => {
      // given
      const dto = {
        id: process.env.LOGIN_ID,
        password: process.env.LOGIN_PASSWORD + '1',
      };

      // when
      try {
        await authService.loginForSchool(dto);
      } catch (e) {
        // then
        expect(e).toBeInstanceOf(AuthFailedException);
      }
    }, 10000);
  });
});
