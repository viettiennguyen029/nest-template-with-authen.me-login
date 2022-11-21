import { IsOptional } from 'class-validator';

export class QueryBetDto {
  @IsOptional()
  type?: string;

  @IsOptional()
  code?: string;

  @IsOptional()
  matchCode?: string;
}
