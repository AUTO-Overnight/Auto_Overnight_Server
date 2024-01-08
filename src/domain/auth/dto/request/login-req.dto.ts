import { IsNotEmpty, IsString } from 'class-validator';

export class LoginReqDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
