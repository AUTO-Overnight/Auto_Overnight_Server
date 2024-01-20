import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { semesterCode } from '../../../../config/school-api';

export class FindStayOutReqListReqDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsIn([...semesterCode])
  @IsNotEmpty()
  semester: string;

  // TODO 사용자 이름을 Request로 받을 필요 없음 - 어차피 학교 API로 조회
  // @IsString()
  // @IsNotEmpty()
  // name: string;

  @IsString()
  @IsNotEmpty()
  cookies: string; // 로그인 후 발급받은 값
}
