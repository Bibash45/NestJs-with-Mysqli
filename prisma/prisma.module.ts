import { Global, Module } from '@nestjs/common';
import { PrismaServices } from './prisma.service';

@Global()
@Module({
  providers: [PrismaServices],
  exports: [PrismaServices],
})
export class PrismaModule {}
