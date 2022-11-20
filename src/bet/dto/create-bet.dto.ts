import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNewBetDto {
  @IsOptional()
  @Type(() => Number)
  matchId: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @Type(() => Number)
  money: number;
}
