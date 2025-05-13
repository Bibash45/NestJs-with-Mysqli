import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User, PublicUser } from 'src/interfaces/user.interface';
import { LoginDto } from './dto/Login.dto';
import { SignupDto } from './dto/Signup.dto';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<PublicUser> {
    const user = await this.usersService.CheckUserByNameOrEmail(
      loginData.identifier,
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Manually return only public fields
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Post('signup')
  async signup(@Body() signupData: SignupDto): Promise<PublicUser> {
    const existingUser = await this.usersService.findByEmail(signupData.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.create(signupData);

    // Manually return only public fields
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
