import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MovementDto {
  @IsNumber()
  id: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  label: string;

  @IsNumber()
  amount: number;
}
