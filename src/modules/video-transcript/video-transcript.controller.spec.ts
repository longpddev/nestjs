import { Test, TestingModule } from '@nestjs/testing';
import { VideoTranscriptController } from './video-transcript.controller';

describe('VideoTranscriptController', () => {
  let controller: VideoTranscriptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoTranscriptController],
    }).compile();

    controller = module.get<VideoTranscriptController>(
      VideoTranscriptController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
