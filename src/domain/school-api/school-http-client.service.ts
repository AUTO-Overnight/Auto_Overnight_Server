import { Injectable } from '@nestjs/common';
import { SchoolFindUsernameResDto } from './dto/response/school-find-username-res.dto';
import { schoolRequestUrl } from '../../config/school-api';
import { findUserNmXML, findYYtmgbnXML } from './dto/request/xmls';
import { SchoolFindSemesterResDto } from './dto/response/school-find-semester-res.dto';
import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { InternalServerException } from '../../global/error/exception/base.exception';
import { UserExceptionCode } from '../../global/error/exception-code';

@Injectable()
export class SchoolHttpClientService {
  async findUserName(
    axiosRef: AxiosInstance,
  ): Promise<SchoolFindUsernameResDto> {
    const response = await axiosRef.post(
      schoolRequestUrl.NAME_ID,
      findUserNmXML,
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
  ): Promise<SchoolFindSemesterResDto> {
    const response = await axiosRef.post(
      schoolRequestUrl.YEAR_SEMESTER,
      findYYtmgbnXML,
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
}
