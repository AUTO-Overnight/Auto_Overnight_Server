import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { semesterCode } from '../../../../config/school-api';

export class FindPointListReqDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsIn([...semesterCode])
  @IsNotEmpty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  cookies: string;
}
