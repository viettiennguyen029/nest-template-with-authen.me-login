import { Injectable } from '@nestjs/common';
import { Match } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prismaService: PrismaService) {}

  async getMatches(): Promise<Match[]> {
    return await this.prismaService.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }
}
