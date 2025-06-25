import { Module } from '@nestjs/common';
import { MovementsModule } from './modules/movements/movements.module';

@Module({
  imports: [MovementsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
