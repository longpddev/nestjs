import { IsNotEmpty } from 'class-validator';

export class VideoMetadataDto {
  @IsNotEmpty()
  progressIndex: number;
}

export const defaultVideoMetadataDto = new VideoMetadataDto();

defaultVideoMetadataDto.progressIndex = 0;
