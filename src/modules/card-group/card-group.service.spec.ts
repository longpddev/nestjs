import { Test, TestingModule } from '@nestjs/testing';
import { CardGroupService } from './card-group.service';

describe('CardGroupService', () => {
  let service: CardGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardGroupService],
    }).compile();

    service = module.get<CardGroupService>(CardGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
