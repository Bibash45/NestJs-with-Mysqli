import { Res, Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.services';
import { LoginDto } from 'src/common/dto/Login.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/common/dto/Signup.dto';
import { PrismaServices } from 'prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private prisma: PrismaServices,
  ) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const user = await this.authService.validateUser(
      dto.identifier,
      dto.password,
    );
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      message: 'Logged in successfully',
    };
  }

  @Post('signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignupDto,
  ) {
    const checkUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (checkUser) {
      throw new ConflictException('Email already exists');
    }
    const user = await this.authService.signup(dto);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return {
      success: true,
      message: 'signup successfully',
    };
  }
}
