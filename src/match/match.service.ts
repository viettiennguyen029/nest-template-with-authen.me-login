import { Injectable } from '@nestjs/common';
import { Match } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';
import { QueryMatchDto } from '@match/dto/query-match.dto';
import { RANGE_TIME } from 'src/common/constant/constants';

@Injectable()
export class MatchService {
  constructor(private prismaService: PrismaService) {}

  async filterMatches(input: QueryMatchDto): Promise<Match[]> {
    const query: { [key: string]: any } = {};
    if (input.matchType) {
      query.type = input.matchType;
    }
    if (input.homeTeamId) {
      query.homeTeamId = input.homeTeamId;
    }
    if (input.awayTeamId) {
      query.awayTeamId = input.awayTeamId;
    }
    if (input.rangeTime) {
      //TODO: support more range time filter
      switch (input.rangeTime) {
        case RANGE_TIME.TODAY:
          const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
          const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));
          query.startTime = {
            gte: todayStart,
            lte: todayEnd,
          };
          break;
        default:
          break;
      }
    }
    return await this.prismaService.match.findMany({
      where: query,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async getMatchById(id: number): Promise<Match> {
    return await this.prismaService.match.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getMatchByCode(code: string): Promise<Match> {
    return await this.prismaService.match.findFirst({
      where: {
        code: code,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }
}
