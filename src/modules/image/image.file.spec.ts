import { Test, TestingModule } from '@nestjs/testing';
import { ImageFile } from './image.file';

describe('ImageFile', () => {
  let provider: ImageFile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageFile],
    }).compile();

    provider = module.get<ImageFile>(ImageFile);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
