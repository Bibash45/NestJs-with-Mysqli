import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Username should only contain alphanumeric characters',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
