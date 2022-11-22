import { Injectable } from '@nestjs/common';
import {Match, Odd} from '@prisma/client';
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
      const now = new Date();
      //TODO: support more range time filter
      switch (input.rangeTime) {
        case RANGE_TIME.TODAY:
          const todayStart = new Date(now.setHours(0, 0, 0, 0));
          const todayEnd = new Date(now.setHours(23, 59, 59, 999));
          query.startTime = {
            gte: todayStart,
            lte: todayEnd,
          };
          break;
        case RANGE_TIME.TOMORROW:
          const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);
          const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
          const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));
          query.startTime = {
            gte: tomorrowStart,
            lte: tomorrowEnd,
          };
          break;
        case RANGE_TIME.THIS_WEEK:
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
      include: {
        homeTeam: true,
        awayTeam: true,
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

  async getOddByMatch(matchId): Promise<Odd[]> {
    return await this.prismaService.odd.findMany({
      where: {
        matchId: matchId
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        match: false,
      },
    });
  }
}
