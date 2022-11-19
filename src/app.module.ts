import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { TeamModule } from './team/team.module';
import { PrismaModule } from './prisma/prisma.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [AuthModule, TeamModule, PrismaModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
