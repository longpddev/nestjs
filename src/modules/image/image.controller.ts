import { AuthGuard } from '@nestjs/passport';
import { ImageFile } from './image.file';
import { ImageService } from './image.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly imageFile: ImageFile,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getFile(@Param('id') id: number) {
    return await this.imageService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body,
  ) {
    const { filename, path } = file;
    const { width, height } = body;
    const result = await this.imageService.create({
      name: filename,
      path,
      width,
      height,
    });
    return {
      id: result.id,
      filename,
      path,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    const image = await this.imageService.getById(id);
    if (!image) throw new NotFoundException("This Image doesn't exit");
    const oldPath = image.path;
    const { filename, path } = file;
    const { width, height } = body;
    await this.imageService.update(id, {
      name: filename,
      path,
      width,
      height,
    });

    this.imageFile.delete(oldPath);
    return {
      id,
      filename,
      path,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const image = await this.imageService.getById(id);
    if (!image) throw new NotFoundException("This Image doesn't exit");
    await this.imageService.delete(id);
    this.imageFile.delete(image.path);

    return 'Successfully deleted';
  }
}
