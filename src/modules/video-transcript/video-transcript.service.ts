import { QueryOptions } from 'src/core/interfaces/common';
import { VIDEO_TRANSCRIPT_REPOSITORY } from './../../core/constants/index';
import { VideoTranscriptDto } from './dto/video-transcript.dto';
import { VideoTranscript } from './video-transcript.entity';
import { ModelService } from 'src/core/interfaces/ModelService';
import { Inject, Injectable } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { existsPromise, unlinkPromise } from 'src/core/helper/function';

@Injectable()
export class VideoTranscriptService
  implements ModelService<VideoTranscript, VideoTranscriptDto>
{
  constructor(
    @Inject(VIDEO_TRANSCRIPT_REPOSITORY)
    private readonly videoTranscriptRepository: typeof VideoTranscript,
    private readonly imageService: ImageService,
  ) {}
  async getById(id: number, userId: number) {
    return await this.videoTranscriptRepository.findOne({
      where: {
        id,
        userId,
      },
    });
  }
  async getAll(userId: number, options?: QueryOptions) {
    const query: { limit?: number; offset?: number } = {};

    if (options) {
      query.limit = options.limit;
      query.offset = (options.pageIndex - 1) * options.limit;
    }

    const params = {
      where: {
        userId,
      },
      ...query,
    };
    const [count, rows] = await Promise.all([
      this.videoTranscriptRepository.count(params),
      this.videoTranscriptRepository.findAll(params),
    ]);
    return {
      count,
      rows: rows ? rows : [],
    };
  }
  async create(data: VideoTranscriptDto, userId: number) {
    return await this.videoTranscriptRepository.create<VideoTranscript>({
      userId,
      ...data,
    });
  }
  async update(
    id: number,
    data: { [key in keyof VideoTranscriptDto]?: VideoTranscriptDto[key] },
    userId?: number,
  ): Promise<number> {
    const [count] = await this.videoTranscriptRepository.update(
      { ...data },
      {
        where: {
          id,
          userId,
        },
      },
    );

    return count;
  }
  async delete(id: number, userId: number): Promise<number> {
    const data = await this.getById(id, userId);

    const result = await this.videoTranscriptRepository.destroy({
      where: {
        id,
        userId,
      },
    });
    const isFileExist = await existsPromise(data.path);

    if (isFileExist) {
      await unlinkPromise(data.path);
    }
    if (data) await this.imageService.delete(data.thumbnailId);
    return result;
  }
}
