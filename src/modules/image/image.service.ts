import { ImageDto } from './dto/image.dto';
import { IMAGE_REPOSITORY } from './../../core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Image } from './image.entity';

@Injectable()
export class ImageService {
  constructor(
    @Inject(IMAGE_REPOSITORY) private readonly imageRepository: typeof Image,
  ) {}

  async getById(id: number) {
    return await this.imageRepository.findOne({ where: { id } });
  }

  async save(image: ImageDto) {
    return await this.imageRepository.create<Image>({
      ...image,
    });
  }

  async delete(id: number) {
    return await this.imageRepository.destroy({ where: { id } });
  }
}
