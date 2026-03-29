import { Test, TestingModule } from '@nestjs/testing';
import { EtablissementsController } from './etablissements.controller';

describe('EtablissementsController', () => {
  let controller: EtablissementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtablissementsController],
    }).compile();

    controller = module.get<EtablissementsController>(EtablissementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
