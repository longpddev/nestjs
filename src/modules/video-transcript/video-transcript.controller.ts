import { QueryOptions } from 'src/core/interfaces/common';
import { VideoTranscriptDto } from './dto/video-transcript.dto';
import { VideoTranscriptService } from './video-transcript.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
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
import {
  unlinkPromise,
  existsPromise,
  uuid,
  changePath,
  getAllFileInFolder,
  createFile,
} from 'src/core/helper/function';
import { createFolder, mergeFiles } from '../../core/helper/function';
import { join } from 'path';
import {
  PUBLIC_FOLDER,
  PUBLIC_VIDEO_FOLDER,
  ROOT_PATH,
  TMP_MULTIPLE_UPLOAD_FOLDER,
} from 'src/core/constants';
import { rm } from 'fs/promises';

@Controller('video')
export class VideoTranscriptController {
  private readonly MULTIPLE_UPLOAD_FOLDER: string = join(
    ROOT_PATH.path,
    PUBLIC_FOLDER,
    TMP_MULTIPLE_UPLOAD_FOLDER,
  );
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
  async upload(
    @Body('data') data: VideoTranscriptDto,
    @Body('tokenUpload') tokenUpload: string,
    @Body('extension') extension: string,
    @Request() req,
  ) {
    if (!['mp4'].includes(extension)) {
      throw new NotAcceptableException('extension do not support');
    }

    const filename = uuid(8) + '.' + extension;
    const tmpPathFolderVideo = join(this.MULTIPLE_UPLOAD_FOLDER, tokenUpload);
    const tmpPathVideo = join(tmpPathFolderVideo, tokenUpload);

    const relativePath = join(PUBLIC_VIDEO_FOLDER, filename);
    const newVideoPath = join(ROOT_PATH.path, relativePath);

    await changePath(tmpPathVideo, newVideoPath);
    await rm(tmpPathFolderVideo, { force: true, recursive: true });
    data.name = filename;
    data.path = relativePath;
    const result = await this.videoTranscriptService.create(data, req.user.id);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('upload-multiple/init')
  async UploadMultipleInit() {
    const timeExpire = new Date().getTime() + 3600000;
    const token = uuid() + '_' + timeExpire;
    createFolder(join(this.MULTIPLE_UPLOAD_FOLDER, token));
    return {
      tokenUpload: token,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-multiple/file')
  @UseInterceptors(FileInterceptor('file'))
  async UploadMultipleFile(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      index: number;
      size: number;
      totalFile: number;
      tokenUpload: string;
    },
  ) {
    const { path } = file;
    const { index, size, totalFile, tokenUpload } = body;
    const newPath = join(
      this.MULTIPLE_UPLOAD_FOLDER,
      tokenUpload,
      `video_${index}`,
    );
    const isExist = await existsPromise(newPath);
    if (isExist) {
      await unlinkPromise(path);
      throw new NotAcceptableException('file exist');
    }
    await changePath(
      path,
      join(this.MULTIPLE_UPLOAD_FOLDER, tokenUpload, `video_${index}`),
    );
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-multiple/merge')
  async UploadMultipleMerge(
    @Body()
    body: {
      tokenUpload: string;
    },
  ) {
    const { tokenUpload } = body;
    const pathToToken = join(this.MULTIPLE_UPLOAD_FOLDER, tokenUpload);
    const fileMerge = join(pathToToken, tokenUpload);

    const paths = (await getAllFileInFolder(pathToToken))
      .sort((a, b) => {
        if (a === b) return 0;
        if (parseInt(a.split('_')[1]) > parseInt(b.split('_')[1])) {
          return 1;
        } else {
          return -1;
        }
      })
      .map((path) => join(pathToToken, path));

    createFile(fileMerge);
    await mergeFiles(paths, fileMerge);

    await Promise.all(
      paths.map(async (path) => {
        const isExist = await existsPromise(path);
        if (isExist) {
          await unlinkPromise(path);
        }
      }),
    );
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/change-video')
  @UseInterceptors(FileInterceptor('file'))
  async changeVideo(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { width?: number; height?: number },
    @Request() req,
  ) {
    const { filename, path } = file;
    const userId = req.user.id;
    let dimension: { width: number; height: number } | Record<string, never> =
      {};
    const video = await this.videoTranscriptService.getById(id, userId);

    if (!video) throw new NotFoundException("This video doesn't exits ");
    if (body?.width && body?.height) {
      dimension = {
        width: body.width,
        height: body.height,
      };
    }
    const oldPath = video.path;
    const [result] = await Promise.all([
      this.videoTranscriptService.update(
        id,
        { path: path, name: filename, ...dimension },
        userId,
      ),
      (async () => {
        const exists = await existsPromise(oldPath);
        if (exists) await unlinkPromise(oldPath);
      })(),
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
