import { Test, TestingModule } from '@nestjs/testing';
import { CardStepService } from './card-step.service';

describe('CardStepService', () => {
  let service: CardStepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardStepService],
    }).compile();

    service = module.get<CardStepService>(CardStepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
