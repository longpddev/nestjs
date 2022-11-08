import createStore from 'src/core/store/imageStore';
import { MulterModule } from '@nestjs/platform-express';
import { ImageModule } from './../image/image.module';
import {
  PUBLIC_VIDEO_FOLDER,
  VIDEO_TRANSCRIPT_REPOSITORY,
} from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { VideoTranscriptService } from './video-transcript.service';
import { VideoTranscriptController } from './video-transcript.controller';
import { VideoTranscript } from './video-transcript.entity';

@Module({
  imports: [
    ImageModule,
    MulterModule.register({
      storage: createStore(PUBLIC_VIDEO_FOLDER),
      limits: {
        fileSize: 1012 * 1012 * 200,
      },
    }),
  ],
  providers: [
    VideoTranscriptService,
    {
      provide: VIDEO_TRANSCRIPT_REPOSITORY,
      useValue: VideoTranscript,
    },
  ],
  controllers: [VideoTranscriptController],
})
export class VideoTranscriptModule {}
