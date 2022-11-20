import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { OddService } from './odd.service';

@Controller('odds')
export class OddController {
  constructor(private readonly oddService: OddService) {}

  @Get()
  @Public()
  async getOdds() {
    try {
      const odds = await this.oddService.getOdds();
      return {
        data: odds,
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
