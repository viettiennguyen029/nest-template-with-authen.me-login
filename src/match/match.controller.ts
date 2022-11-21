import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { MatchService } from '@match/match.service';
import { QueryMatchDto } from '@match/dto/query-match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Public()
  async getMatches(@Query() query: QueryMatchDto) {
    try {
      const matches = await this.matchService.filterMatches(query);
      return {
        data: matches,
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
