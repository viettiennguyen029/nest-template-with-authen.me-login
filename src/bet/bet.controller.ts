import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  UsePipes,
  ValidationPipe,
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
