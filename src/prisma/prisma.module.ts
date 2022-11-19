import { Module } from '@nestjs/common';

import { PrismaService } from '@prisma_module/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
