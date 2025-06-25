import { Body, Controller, Post } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidateMovementsResponse } from './interfaces/validate-movements-response.interface';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('validation')
  validate(@Body() dto: ValidateMovementsDto): ValidateMovementsResponse {
    return this.movementsService.validateMovements(dto);
  }
}
