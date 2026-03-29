import { Test, TestingModule } from '@nestjs/testing';
import { DiffusionsService } from './diffusions.service';

describe('DiffusionsService', () => {
  let service: DiffusionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiffusionsService],
    }).compile();

    service = module.get<DiffusionsService>(DiffusionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
