import { MatchModule } from '@match/match.module';
import { MatchService } from '@match/match.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma_module/prisma.module';
import { BetController } from './bet.controller';
import { BetService } from './bet.service';

@Module({
  imports: [PrismaModule, MatchModule],
  controllers: [BetController],
  providers: [BetService, MatchService],
})
export class BetModule {}
