import { Test, TestingModule } from '@nestjs/testing';
import { FileTempController } from './file-temp.controller';

describe('FileTempController', () => {
  let controller: FileTempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileTempController],
    }).compile();

    controller = module.get<FileTempController>(FileTempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
