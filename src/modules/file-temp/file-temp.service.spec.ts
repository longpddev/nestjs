import { Test, TestingModule } from '@nestjs/testing';
import { FileTempService } from './file-temp.service';

describe('FileTempService', () => {
  let service: FileTempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileTempService],
    }).compile();

    service = module.get<FileTempService>(FileTempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
