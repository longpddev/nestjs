import { ImageFile } from './image.file';
// import storage from 'src/core/store/imageStore';
import { IMAGE_REPOSITORY } from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Image } from './image.entity';
import { MulterModule } from '@nestjs/platform-express';
import createStore from 'src/core/store/imageStore';

@Module({
  imports: [
    MulterModule.register({
      storage: createStore('public/upload/image'),
    }),
  ],
  controllers: [ImageController],
  providers: [
    ImageService,
    {
      provide: IMAGE_REPOSITORY,
      useValue: Image,
    },
    Image,
    ImageFile,
  ],
  exports: [ImageService],
})
export class ImageModule {}
