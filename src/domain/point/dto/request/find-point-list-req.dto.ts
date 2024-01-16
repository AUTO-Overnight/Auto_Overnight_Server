import { IsNotEmpty, IsString } from 'class-validator';

export class FindPointListReqDto {
  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cookies: string;
}
