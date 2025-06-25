import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MovementDto } from './movement.dto';
import { BalanceDto } from './balance.dto';

export class ValidateMovementsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDto)
  movements: MovementDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  balances: BalanceDto[];
}
