import { IsString } from 'class-validator';

export class LoginReqDto {
  @IsString()
  id: string;

  @IsString()
  password: string;
}
