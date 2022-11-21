import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { BetService } from '@bet/bet.service';
import { CreateNewBetDto } from '@bet/dto/create-bet.dto';
import { AuthenticatedGuard } from 'src/common/guard/authenticated.guard';
import { IRequest } from 'src/common/interface/common.interface';
import { QueryBetDto } from '@bet/dto/query-bet-dto';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createNewBet(@Req() request: IRequest, @Body() body: CreateNewBetDto) {
    const username: string = request.user.preferred_username as string;
    const newBet = await this.betService.createNewBet(body, username);
    return {
      data: newBet,
    };
  }

  @Post('bets-recognition')
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async recognitionsBetsResult(
    @Query('matchCode') matchCode: string,
    @Query('type') type: string,
  ) {
    return await this.betService.recognitionsBetsResult(matchCode, type);
  }

  @Get()
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBets(@Query() query: QueryBetDto) {
    try {
      const bets = await this.betService.filterBets(query);
      return {
        data: bets,
      };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data?.error
            ? error.response.data.error
            : error.response.data,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBetById(@Param('id') id: number) {
    try {
      const bet = await this.betService.getBetById(id);
      return {
        data: bet,
      };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data?.error
            ? error.response.data.error
            : error.response.data,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }
}
