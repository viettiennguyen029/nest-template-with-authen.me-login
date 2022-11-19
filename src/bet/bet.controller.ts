import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Public } from 'src/common/public.decorator';
import { BetService } from './bet.service';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Get()
  @Public()
  async getBets() {
    try {
      const bets = await this.betService.getBets();
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
}
