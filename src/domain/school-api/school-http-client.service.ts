import { Injectable } from '@nestjs/common';
import { SchoolFindUsernameResDto } from './dto/response/school-find-username-res.dto';
import { schoolUrl } from '../../config';
import { findUserNmXML, findYYtmgbnXML } from './dto/request/xmls';
import { SchoolFindSemesterResDto } from './dto/response/school-find-semester-res.dto';
import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class SchoolHttpClientService {
  async findUserName(
    axiosRef: AxiosInstance,
  ): Promise<SchoolFindUsernameResDto> {
    const response = await axiosRef.post(schoolUrl.NAME_ID, findUserNmXML);
    const responseData = cheerio.load(response.data, {
      xmlMode: true,
    });

    const username = responseData('Col[id="userNm"]').text();
    const userStudentId = responseData('Col[id="persNo"]').text();

    return SchoolFindUsernameResDto.of(username, userStudentId);
  }
  async findYearAndSemester(
    axiosRef: AxiosInstance,
  ): Promise<SchoolFindSemesterResDto> {
    const response = await axiosRef.post(
      schoolUrl.YEAR_SEMESTER,
      findYYtmgbnXML,
    );
    const responseData = cheerio.load(response.data, { xmlMode: true });

    const year = responseData('Col[id="yy"]').text();
    const semester = responseData('Col[id="tmGbn"]').text();

    return SchoolFindSemesterResDto.of(year, semester);
  }
}
