import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bet } from '@prisma/client';
import { PrismaService } from '@prisma_module/prisma.service';
import { CreateNewBetDto } from '@bet/dto/create-bet.dto';
import { BET_STATUS, ODDS_CODE } from 'src/common/consts';

@Injectable()
export class BetService {
  constructor(private prismaService: PrismaService) {}

  async recognitionsBetsResult(matchCode: string) {
    // Get all bets record of this match
    const match = await this.prismaService.match.findFirst({
      where: {
        code: matchCode,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
    if (!match) {
      throw new HttpException('Match code is invalid', HttpStatus.BAD_REQUEST);
    }
    if (!match.matchTimeHome || !match.matchTimeAway) {
      throw new HttpException(
        'Match result is not updated',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bets = await this.filterBets(match.id);
    let status = BET_STATUS.INIT;

    if (match.matchTimeHome > match.matchTimeAway) {
      bets.forEach(async (bet) => {
        if (bet.code == ODDS_CODE.HOME) {
          status = BET_STATUS.WIN;
        } else status = BET_STATUS.LOSE;
        await this.updateBetResult(bet.id, status, bet.money, bet.ratio);
      });
    } else if (match.matchTimeHome < match.matchTimeAway) {
      bets.forEach(async (bet) => {
        if (bet.code == ODDS_CODE.AWAY) {
          status = BET_STATUS.WIN;
        } else status = BET_STATUS.LOSE;
        await this.updateBetResult(bet.id, status, bet.money, bet.ratio);
      });
    } else if (match.matchTimeHome == match.matchTimeAway) {
      bets.forEach(async (bet) => {
        if (bet.code == ODDS_CODE.DRAW) {
          status = BET_STATUS.WIN;
        } else status = BET_STATUS.LOSE;
        await this.updateBetResult(bet.id, status, bet.money, bet.ratio);
      });
    }
  }

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
        status: BET_STATUS.INIT,
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

  async filterBets(
    matchId?: number,
    code?: string,
    userId?: number,
  ): Promise<Bet[]> {
    const query: { [key: string]: any } = {};
    if (matchId) {
      query.matchId = matchId;
    }
    if (code) {
      query.code = code;
    }
    if (userId) {
      query.userId = userId;
    }
    return await this.prismaService.bet.findMany({
      where: query,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateBetResult(
    id: number,
    status: string,
    money: number,
    ratio: number,
  ) {
    const updateData: { [key: string]: any } = {};
    if (status == BET_STATUS.WIN) {
      updateData.prize = money * ratio;
      updateData.loss = 0;
    } else if (status == BET_STATUS.LOSE) {
      updateData.prize = 0;
      updateData.loss = money * ratio;
    }
    return await this.prismaService.bet.update({
      where: {
        id: id,
      },
      data: { ...updateData, status: status },
    });
  }
}
