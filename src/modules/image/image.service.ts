import { existsPromise, unlinkPromise } from 'src/core/helper/function';
import { ImageFile } from './image.file';
import { ModelService } from './../../core/interfaces/ModelService';
import { ImageDto } from './dto/image.dto';
import { IMAGE_REPOSITORY } from './../../core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Image } from './image.entity';

@Injectable()
export class ImageService implements ModelService<Image, ImageDto> {
  constructor(
    @Inject(IMAGE_REPOSITORY) private readonly imageRepository: typeof Image,
    private readonly imageFile: ImageFile,
  ) {}

  async getById(id: number) {
    return await this.imageRepository.findOne({ where: { id } });
  }

  async getAll() {
    return await this.imageRepository.findAndCountAll();
  }

  async create(image: ImageDto) {
    return await this.imageRepository.create<Image>({
      ...image,
    });
  }

  async update(id: number, data: ImageDto): Promise<number> {
    const [numberOfAffectedRows] = await this.imageRepository.update<Image>(
      {
        ...data,
      },
      { where: { id } },
    );

    return numberOfAffectedRows;
  }

  async delete(id: number) {
    const image = await this.getById(id);
    const result = await this.imageRepository.destroy({ where: { id } });
    const isFileExist = await existsPromise(image.path);
    if (isFileExist) {
      await unlinkPromise(image.path);
    }
    return result;
  }
}
