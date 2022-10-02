import { FileTempDto } from './dto/file-temp.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileTempService } from './file-temp.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

@Controller('file-temp')
export class FileTempController {
  constructor(private readonly fileTempService: FileTempService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('get')
  async getFile(@Body() body: FileTempDto) {
    const result = await this.fileTempService.download(body.url);

    return result;
  }
}
