import { IsNotEmpty } from 'class-validator';
import { VideoMetadataDto } from './video-metadata.dto';
export class VideoTranscriptDto {
  path?: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  thumbnailId: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  metadata: VideoMetadataDto;

  @IsNotEmpty()
  transcript: string;
}
