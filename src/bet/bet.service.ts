import { Injectable } from '@nestjs/common';
import { Bet } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';

@Injectable()
export class BetService {
  constructor(private prismaService: PrismaService) {}

  async getBets(): Promise<Bet[]> {
    return await this.prismaService.bet.findMany({
      include: {
        match: true,
      },
    });
  }

  async getBetById(id: number): Promise<Bet> {
    return await this.prismaService.bet.findUnique({
      where: {
        id: id,
      },
      include: {
        match: true,
      },
    });
  }
}
