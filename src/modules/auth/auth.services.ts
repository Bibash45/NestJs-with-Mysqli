import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../user/user.service';
import { SignupDto } from 'src/common/dto/Signup.dto';
import { PrismaServices } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaServices,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.usersService.CheckUserByNameOrEmail(identifier);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signup(signupDto: SignupDto) {
    return this.usersService.create(signupDto);
  }
}
