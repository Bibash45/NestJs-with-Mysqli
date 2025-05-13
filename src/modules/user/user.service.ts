import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { ApiResponse, PublicUser } from './interfaces/user.interface';
import { PrismaServices } from 'prisma/prisma.service';
import { SignupDto } from 'src/common/dto/Signup.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaServices) {}

  async findAll(): Promise<PublicUser[]> {
    const users = this.prisma.user.findMany({});
    return users;
  }
  async findOne(userID: number): Promise<ApiResponse<PublicUser>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userID },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const { password, ...publicUser } = user;
    return {
      success: true,
      message: 'User fetched successfully',
      data: publicUser,
    };
  }

  async CheckUserByNameOrEmail(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ name: identifier }, { email: identifier }],
      },
    });
  }

  async create(signupData: SignupDto): Promise<PublicUser> {
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: signupData.name,
        email: signupData.email,
        password: hashedPassword,
      },
    });
    const { password, ...publicUser } = user;
    return publicUser;
  }
}
