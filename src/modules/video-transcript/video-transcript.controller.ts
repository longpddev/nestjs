import { defaultVideoMetadataDto } from './dto/video-metadata.dto';
import { QueryOptions } from 'src/core/interfaces/common';
import { VideoTranscriptDto } from './dto/video-transcript.dto';
import { VideoTranscriptService } from './video-transcript.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { unlink } from 'fs';

@Controller('video')
export class VideoTranscriptController {
  constructor(
    private readonly videoTranscriptService: VideoTranscriptService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(
    @Request() req,
    @Query() query?: { pageIndex: string; limit: string },
  ) {
    let options: QueryOptions | undefined = undefined;
    if (query && Object.keys(query).length > 0) {
      options = {
        limit: parseInt(query.limit),
        pageIndex: parseInt(query.pageIndex),
      };
    }

    return await this.videoTranscriptService.getAll(req.user.id, options);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getById(@Param('id') id: number, @Request() req) {
    return await this.videoTranscriptService.getById(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: VideoTranscriptDto,
    @Request() req,
  ) {
    const { filename, path } = file;
    console.log(body);
    body.path = path;
    body.name = filename;
    // body.metadata = {
    //   ...defaultVideoMetadataDto,
    //   ...body.metadata,
    // };
    const result = await this.videoTranscriptService.create(body, req.user.id);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/change-video')
  @UseInterceptors(FileInterceptor('file'))
  async changeVideo(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const { filename, path } = file;
    const userId = req.user.id;
    const video = await this.videoTranscriptService.getById(id, userId);

    if (!video) throw new NotFoundException("This video doesn't exits ");

    const oldPath = video.path;
    const [result] = await Promise.all([
      this.videoTranscriptService.update(
        id,
        { path: path, name: filename },
        userId,
      ),
      new Promise((res, rej) => {
        unlink(oldPath, (err) => {
          if (!err) res(true);
          rej(err);
        });
      }),
    ]);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body()
    body: { [key in keyof VideoTranscriptDto]: VideoTranscriptDto[key] },
    @Request() req,
  ) {
    const userId = req.user.id;
    return await this.videoTranscriptService.update(id, body, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    return await this.videoTranscriptService.delete(id, req.user.id);
  }
}
