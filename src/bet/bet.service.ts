import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bet } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';
import { CreateNewBetDto } from '@bet/dto/create-bet.dto';

@Injectable()
export class BetService {
  constructor(private prismaService: PrismaService) {}

  async createNewBet(data: CreateNewBetDto, createdBy: string): Promise<Bet> {
    // Odds validations
    const odd = await this.prismaService.odd.findFirst({
      where: {
        matchId: data.matchId,
        type: data.type,
        code: data.code,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const user = await this.prismaService.user.findUnique({
      where: {
        username: createdBy,
      },
    });

    // Calculate total money of user in same match with same type
    const aggregations = await this.prismaService.bet.aggregate({
      _sum: {
        money: true,
      },
      where: {
        userId: user.id,
        matchId: data.matchId,
        type: data.type,
      },
    });

    const config = await this.prismaService.config.findFirst({
      where: {
        id: 1,
      },
    });
    // Max money can bet validation
    if (
      aggregations._sum.money &&
      data.money + aggregations._sum.money > config.maxMoneyCanBet
    ) {
      throw new HttpException(
        'Bet money has reached limit',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cannot create bet when match is started
    const now = new Date();
    const match = await this.prismaService.match.findUnique({
      where: {
        id: data.matchId,
      },
    });
    if (now > match.startTime) {
      throw new HttpException(
        'Cannot create new bet when match is started',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prismaService.bet.create({
      data: {
        userId: user.id,
        matchId: data.matchId,
        type: data.type,
        code: data.code,
        status: 'INIT', // TODO: use const instead
        ratio: odd.ratio,
        money: data.money,
        prize: 0,
      },
    });
  }

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
