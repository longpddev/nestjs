import { Test, TestingModule } from '@nestjs/testing';
import { VideoTranscriptService } from './video-transcript.service';

describe('VideoService', () => {
  let service: VideoTranscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoTranscriptService],
    }).compile();

    service = module.get<VideoTranscriptService>(VideoTranscriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
