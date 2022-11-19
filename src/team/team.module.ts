import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma_module/prisma.module';
import { TeamController } from '@team/team.controller';
import { TeamService } from '@team/team.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
