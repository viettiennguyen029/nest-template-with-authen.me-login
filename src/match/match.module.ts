import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma_module/prisma.module';
import { MatchController } from '@match/match.controller';
import { MatchService } from '@match/match.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
