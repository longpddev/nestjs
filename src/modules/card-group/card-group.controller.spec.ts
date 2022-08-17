import { Test, TestingModule } from '@nestjs/testing';
import { CardGroupController } from './card-group.controller';

describe('CardGroupController', () => {
  let controller: CardGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardGroupController],
    }).compile();

    controller = module.get<CardGroupController>(CardGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
