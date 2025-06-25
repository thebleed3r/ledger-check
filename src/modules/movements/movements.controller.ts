import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { ValidateMovementsDto } from './dto/validate-movements.dto';
import { ValidateMovementsResponse } from './interfaces/validate-movements-response.interface';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  /**
   * POST /movements/validation
   *
   * Validates a set of movements and checkpoints for consistency. This endpoint does not modify any data or state on the server.
   *
   * @param dto The request body containing movements and balance checkpoints to validate.
   * @returns {ValidateMovementsResponse} A result object with a message and, if validation fails, a list of reasons.
   *
   * **Response codes:**
   * - 200 OK: The validation was performed successfully. The response body indicates whether the data is valid or not.
   *   - If validation succeeds: `{ "message": "Accepted" }`
   *   - If validation fails: `{ "message": "Validation failed", "reasons": [ { "type": "...", "message": "...", "details": {...} } ] }`
   * - 400 Bad Request: Only if the request is malformed or invalid (e.g., missing required fields, invalid JSON).
   *
   * **Note:** This endpoint always returns 200 OK if the request is valid, even if the data fails validation. The validation result is detailed in the response body.
   */
  @Post('validation')
  @HttpCode(200)
  validate(@Body() dto: ValidateMovementsDto): ValidateMovementsResponse {
    const validationResponse = this.movementsService.validateMovements(dto);
    return validationResponse;
  }
}
