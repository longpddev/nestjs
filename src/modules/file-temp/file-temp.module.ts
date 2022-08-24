import { Module } from '@nestjs/common';
import { FileTempService } from './file-temp.service';
import { FileTempController } from './file-temp.controller';

@Module({
  providers: [FileTempService],
  controllers: [FileTempController]
})
export class FileTempModule {}
