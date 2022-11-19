import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';
import { QueryTeamDto } from '@team/dto/query-team.dto';

@Injectable()
export class TeamService {
  constructor(private prismaService: PrismaService) {}

  async getTeams(query: QueryTeamDto): Promise<Team[]> {
    return await this.prismaService.team.findMany({
      where: {
        groupCode: query.groupCode,
      },
    });
  }
}
