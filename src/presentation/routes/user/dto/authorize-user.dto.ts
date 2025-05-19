import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthorizeUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
