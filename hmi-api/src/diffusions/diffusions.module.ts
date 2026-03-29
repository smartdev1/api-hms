import { Module } from '@nestjs/common';
import { DiffusionsController } from './diffusions.controller';
import { DiffusionsService } from './diffusions.service';

@Module({
  controllers: [DiffusionsController],
  providers: [DiffusionsService]
})
export class DiffusionsModule {}
