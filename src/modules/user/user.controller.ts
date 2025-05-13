import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
  ApiResponse,
  PublicUser,
} from 'src/modules/user/interfaces/user.interface';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaServices } from 'prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaServices,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async getUsers(): Promise<PublicUser[] | null> {
    return await this.usersService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async updateUsers(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: UpdateUserDto,
    @Param('id') userId: string,
  ): Promise<ApiResponse<PublicUser>> {
    const id = parseInt(userId);

    const user = await this.usersService.findOne(id);
    if (!user || !user.data) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name || user.data.name,
        email: dto.email || user.data.email,
      },
    });

    const { password, ...publicUser } = updatedUser;

    return {
      success: true,
      message: 'User updated successfully',
      data: publicUser,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async deleteUser(
    @Param('id') userId: string,
  ): Promise<ApiResponse<PublicUser>> {
    const id = parseInt(userId);
    const user = await this.usersService.findOne(id);

    if (!user || !user.data) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    const { password, ...publicUser } = deletedUser;

    return {
      success: true,
      message: 'User deleted successfully',
      data: publicUser,
    };
  }
}
