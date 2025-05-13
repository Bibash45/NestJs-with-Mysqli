import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class LoginDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
