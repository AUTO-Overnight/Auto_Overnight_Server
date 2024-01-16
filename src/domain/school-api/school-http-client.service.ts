import { Injectable } from '@nestjs/common';
import { SchoolFindUsernameResDto } from './dto/response/school-find-username-res.dto';
import { schoolRequestUrl, xml_RequestHeader } from '../../config/school-api';
import {
  FindDormitoryStudentInfoXML,
  findUserNameXML,
  findYearAndSemesterXML,
} from './dto/request/xmls';
import { SchoolFindSemesterResDto } from './dto/response/school-find-semester-res.dto';
import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { InternalServerException } from '../../global/error/exception/base.exception';
import { UserExceptionCode } from '../../global/error/exception-code';
import { SchoolFindDormitoryStudentInfoReqDto } from './dto/request/school-find-dormitory-student-info-req.dto';
import { SchoolFindDormitoryStudentInfoResDto } from './dto/response/school-find-dormitory-student-info-res.dto';

@Injectable()
export class SchoolHttpClientService {
  async findUserName(
    axiosRef: AxiosInstance,
  ): Promise<SchoolFindUsernameResDto> {
    const response = await axiosRef.post(
      schoolRequestUrl.NAME_ID,
      findUserNameXML,
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
      findYearAndSemesterXML,
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

  async findDormitoryStudentInfo(
    axiosRef: AxiosInstance,
    dto: SchoolFindDormitoryStudentInfoReqDto,
  ): Promise<SchoolFindDormitoryStudentInfoResDto> {
    const xml = dto.toXmlForSchoolRequest(FindDormitoryStudentInfoXML);

    const requestConfig = {
      headers: xml_RequestHeader,
    };

    const response = await axiosRef.post(
      schoolRequestUrl.REWARD_LIST,
      xml,
      requestConfig,
    );

    const responseDto = SchoolFindDormitoryStudentInfoResDto.of();

    const $ = cheerio.load(response.data, { xml: true });
    $('Row').each(function () {
      const cmpScr = $(this).children('Col[id="cmpScr"]').text();
      const lifSstArdGbn = $(this).children('Col[id="lifSstArdGbn"]').text();
      const ardInptDt = $(this).children('Col[id="ardInptDt"]').text();
      const lifSstArdCtnt = $(this).children('Col[id="lifSstArdCtnt"]').text();
      responseDto.addNewOne(cmpScr, lifSstArdGbn, ardInptDt, lifSstArdCtnt);
    });

    return responseDto;
  }
}
