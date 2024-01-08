import { Injectable } from '@nestjs/common';
import { schoolUrl } from '../../config';
import { findUserNmXML, findYYtmgbnXML } from '../../model/school-request/xmls';
import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { SchoolFindUsernameResDto } from '../../model/school-response/school-find-username-res.dto';
import { SchoolFindSemesterResDto } from '../../model/school-response/school-find-semester-res.dto';
@Injectable()
export class UserService {
  async findUserName(axiosRef: AxiosInstance):Promise<SchoolFindUsernameResDto> {
    const response = await axiosRef.post(schoolUrl.NAME_ID, findUserNmXML);
    const responseData = cheerio.load(response.data, {
      xmlMode: true,
    });

    const username = responseData('Col[id="userNm"]').text();
    const userStudentId = responseData('Col[id="persNo"]').text();

    return SchoolFindUsernameResDto.of(username, userStudentId);
  }
  async findYearAndSemester(axiosRef: AxiosInstance): Promise<SchoolFindSemesterResDto> {
    const response = await axiosRef.post(schoolUrl.YEAR_SEMESTER, findYYtmgbnXML);
    const responseData = cheerio.load(response.data, {xmlMode: true});

    const year = responseData('Col[id="yy"]').text();
    const semester = responseData('Col[id="tmGbn"]').text();

    return SchoolFindSemesterResDto.of(year, semester);
  }
}
