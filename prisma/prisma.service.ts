import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServices extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log('1. Database connected');
  }

  async enableShutdownHooks(app: INestApplication) {
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
