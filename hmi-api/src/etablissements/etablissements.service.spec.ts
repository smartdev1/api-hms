import { Test, TestingModule } from '@nestjs/testing';
import { EtablissementsService } from './etablissements.service';

describe('EtablissementsService', () => {
  let service: EtablissementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtablissementsService],
    }).compile();

    service = module.get<EtablissementsService>(EtablissementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
