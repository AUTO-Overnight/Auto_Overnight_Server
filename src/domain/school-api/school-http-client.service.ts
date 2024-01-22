import { Injectable } from '@nestjs/common';
import { SchoolFindUsernameResDto } from './dto/response/school-find-username-res.dto';
import {
  SCHOOL_URL,
  schoolRequestUrl,
  x_www_form_urlencoded_RequestHeader,
  xml_RequestHeader,
} from '../../config/school-api';
import {
  FindDormitoryStudentInfoXML,
  findUserNameXML,
  findYearAndSemesterXML,
} from './dto/request/xmls';
import { SchoolFindSemesterResDto } from './dto/response/school-find-semester-res.dto';
import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import {
  AuthFailedException,
  InternalServerException,
} from '../../global/error/exception/base.exception';
import {
  AuthExceptionCode,
  PointExceptionCode,
  UserExceptionCode,
} from '../../global/error/exception-code';
import { SchoolFindDormitoryRewardsReqDto } from './dto/request/school-find-dormitory-rewards-req.dto';
import { SchoolFindDormitoryRewardsResDto } from './dto/response/school-find-dormitory-rewards-res.dto';
import { formatDate } from '../../util/string-utils';
import { SchoolLoginReqDto } from './dto/request/school-login-req.dto';
import { Cookie, CookieJar } from 'tough-cookie';

@Injectable()
export class SchoolHttpClientService {
  private readonly LOGIN_ERROR_MESSAGE_SEPERATOR: string = '"';
  private readonly LOGIN_ERROR_MESSAGE: string = '인증에 실패했습니다';
  private readonly LOGIN_ERROR_MESSAGE_INDEX: number = 3;

  async getSession(
    axiosRef: AxiosInstance,
    id: string,
    cookieJar: CookieJar,
  ): Promise<string> {
    const base64encode = Buffer.from(id, 'utf8').toString('base64');
    const requestConfig = {
      jar: cookieJar,
    };

    const response = await axiosRef.get(
      schoolRequestUrl.SESSION + base64encode,
      requestConfig,
    );

    const cookies = response.request._headers.cookie;

    if (cookies == null) {
      throw new InternalServerException(AuthExceptionCode.AUTH_FAILED);
    }
    return cookies;
  }

  async login(
    axiosRef: AxiosInstance,
    dto: SchoolLoginReqDto,
  ): Promise<string> {
    const cookieJar = new CookieJar();

    const requestConfig = {
      headers: x_www_form_urlencoded_RequestHeader,
      jar: cookieJar,
    };

    const response = await axiosRef.post(
      schoolRequestUrl.LOGIN,
      dto,
      requestConfig,
    );

    const responseMessage = response.data.toString();
    const resDataArray = responseMessage.split(
      this.LOGIN_ERROR_MESSAGE_SEPERATOR,
    );
    if (responseMessage.includes(this.LOGIN_ERROR_MESSAGE)) {
      throw new AuthFailedException(
        AuthExceptionCode.AUTH_FAILED,
        resDataArray[this.LOGIN_ERROR_MESSAGE_INDEX],
      );
    }

    return this.getSession(axiosRef, dto.internalId, response.config.jar);
  }

  async findUserInfo(
    axiosRef: AxiosInstance,
    cookie: Cookie,
  ): Promise<SchoolFindUsernameResDto> {
    // cookie 설정
    const cookieJar = new CookieJar();
    await cookieJar.setCookie(cookie, SCHOOL_URL);

    const requestConfig = {
      jar: cookieJar,
    };

    const response = await axiosRef.post(
      schoolRequestUrl.NAME_ID,
      findUserNameXML,
      requestConfig,
    );

    const $ = cheerio.load(response.data, {
      xmlMode: true,
    });
    const username = $('Col[id="userNm"]').text();
    const userStudentId = $('Col[id="persNo"]').text();
    const errorCode = $('Parameter[id="ErrorCode"]').text();

    if (errorCode !== '0' || username === '' || userStudentId === '') {
      throw new InternalServerException(
        UserExceptionCode.FIND_USER_INFO_FAILED,
      );
    }

    return SchoolFindUsernameResDto.of(username, userStudentId);
  }

  async findYearAndSemester(
    axiosRef: AxiosInstance,
    cookie: Cookie,
  ): Promise<SchoolFindSemesterResDto> {
    // cookie 설정
    const cookieJar = new CookieJar();
    await cookieJar.setCookie(cookie, SCHOOL_URL);

    const requestConfig = {
      jar: cookieJar,
    };

    const response = await axiosRef.post(
      schoolRequestUrl.YEAR_SEMESTER,
      findYearAndSemesterXML,
      requestConfig,
    );

    const $ = cheerio.load(response.data, { xmlMode: true });
    const year = $('Col[id="yy"]').text();
    const semester = $('Col[id="tmGbn"]').text();
    const errorCode = $('Parameter[id="ErrorCode"]').text();

    if (errorCode !== '0' || year === '' || semester === '') {
      throw new InternalServerException(
        UserExceptionCode.FIND_USER_INFO_FAILED,
      );
    }
    return SchoolFindSemesterResDto.of(year, semester);
  }

  async findDormitoryRewards(
    axiosRef: AxiosInstance,
    dto: SchoolFindDormitoryRewardsReqDto,
    cookie: Cookie,
  ): Promise<SchoolFindDormitoryRewardsResDto> {
    const xml = dto.toXmlForSchoolRequest(FindDormitoryStudentInfoXML);
    // cookie 설정
    const cookieJar = new CookieJar();
    await cookieJar.setCookie(cookie, SCHOOL_URL);

    const requestConfig = {
      headers: xml_RequestHeader,
      jar: cookieJar,
    };

    const response = await axiosRef.post(
      schoolRequestUrl.REWARD_LIST,
      xml,
      requestConfig,
    );

    const responseDto = SchoolFindDormitoryRewardsResDto.of();
    const $ = cheerio.load(response.data, { xml: true });

    const errorCode = $('Parameter[id="ErrorCode"]').text();
    if (errorCode !== '0') {
      throw new InternalServerException(
        PointExceptionCode.FIND_POINT_LIST_FAILED,
      );
    }

    $('Row').each(function () {
      const score = $(this).children('Col[id="cmpScr"]').text();
      const scoreType = $(this).children('Col[id="lifSstArdGbn"]').text();
      const date = $(this).children('Col[id="ardInptDt"]').text();
      const content = $(this).children('Col[id="lifSstArdCtnt"]').text();

      if (score != '' || scoreType != '' || date != '' || content != '') {
        responseDto.addNewOne(score, scoreType, formatDate(date), content);
      }
    });
    return responseDto;
  }
}
