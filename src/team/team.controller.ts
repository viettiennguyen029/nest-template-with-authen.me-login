import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TeamService } from '@team/team.service';
import { Public } from 'src/common/decorator/public.decorator';
import { QueryTeamDto } from './dto/query-team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTeams(@Query() query: QueryTeamDto) {
    try {
      const teams = await this.teamService.getTeams(query);
      return {
        data: teams,
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
