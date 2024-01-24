import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { semesterCode } from '../../../../config/school-api';

export class FindStayoutApplyListReqDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsIn([...semesterCode])
  @IsNotEmpty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  cookies: string; // 로그인 후 발급받은 값
}
