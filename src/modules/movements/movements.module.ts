import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';

@Module({
  imports: [],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [],
})
export class MovementsModule {}
