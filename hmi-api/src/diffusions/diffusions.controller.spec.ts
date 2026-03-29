import { Test, TestingModule } from '@nestjs/testing';
import { DiffusionsController } from './diffusions.controller';

describe('DiffusionsController', () => {
  let controller: DiffusionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiffusionsController],
    }).compile();

    controller = module.get<DiffusionsController>(DiffusionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
