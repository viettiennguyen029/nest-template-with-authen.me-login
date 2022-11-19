import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma_module/prisma.module';
import { BetController } from './bet.controller';
import { BetService } from './bet.service';

@Module({
  imports: [PrismaModule],
  controllers: [BetController],
  providers: [BetService],
})
export class BetModule {}
