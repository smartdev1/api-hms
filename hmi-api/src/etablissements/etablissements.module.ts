import { Module } from '@nestjs/common';
import { EtablissementsController } from './etablissements.controller';
import { EtablissementsService } from './etablissements.service';

@Module({
  controllers: [EtablissementsController],
  providers: [EtablissementsService]
})
export class EtablissementsModule {}
