import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { RANGE_TIME } from 'src/common/constant/constants';

export class QueryMatchDto {
  @IsOptional()
  matchType: string;

  @IsOptional()
  rangeTime: RANGE_TIME;

  @IsOptional()
  @Type(() => Number)
  homeTeamId: number;

  @IsOptional()
  @Type(() => Number)
  awayTeamId: number;
}
