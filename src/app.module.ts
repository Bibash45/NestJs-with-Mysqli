import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, UsersModule],
})
export class AppModule {}
