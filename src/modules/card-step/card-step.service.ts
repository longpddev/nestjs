import { CardStepDto } from './dto/card-step.dto';
import { ModelService } from './../../core/interfaces/ModelService';
import { CARD_STEP_REPOSITORY } from './../../core/constants/index';
import { Inject, Injectable } from '@nestjs/common';
import { CardStep } from './card-step.entity';
import { ParentModelService } from 'src/core/interfaces/ParentModelService';
import { Op } from 'sequelize';
import { ImageService } from '../image/image.service';

@Injectable()
export class CardStepService
  implements ModelService<CardStep, CardStepDto>, ParentModelService<CardStep>
{
  constructor(
    @Inject(CARD_STEP_REPOSITORY)
    private readonly cardStepRepository: typeof CardStep,
    private readonly imageService: ImageService,
  ) {}

  async getAll(): Promise<CardStep[]> {
    return await this.cardStepRepository.findAll();
  }
  async getById(id: number) {
    return await this.cardStepRepository.findOne({
      where: { id },
    });
  }

  async create(data: CardStepDto) {
    return await this.cardStepRepository.create<CardStep>({
      ...data,
    });
  }

  async update(id: number, data: CardStepDto): Promise<number> {
    const [numberOfAffectedRows] =
      await this.cardStepRepository.update<CardStep>(
        {
          ...data,
        },
        {
          where: { id },
        },
      );

    return numberOfAffectedRows;
  }

  async delete(id: number): Promise<number> {
    // TODO delete image either
    const cardStep = await this.getById(id);
    if (cardStep) await this.imageService.delete(cardStep.imageId);
    return await this.cardStepRepository.destroy<CardStep>({
      where: { id },
    });
  }

  async getAllByParent(id: number) {
    return await this.cardStepRepository.findAll({
      where: { cardId: id },
    });
  }

  async deleteAllByParent(id: number): Promise<number> {
    const list = await this.getAllByParent(id);
    await Promise.all(
      list.map((item) => this.imageService.delete(item.imageId)),
    );

    return await this.cardStepRepository.destroy({
      where: {
        cardId: { [Op.in]: list.map((item) => item.id) },
      },
    });
  }
}
