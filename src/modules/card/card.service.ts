import { CardStepService } from './../card-step/card-step.service';
import { CardDto } from './dto/card.dto';
import { ModelService } from 'src/core/interfaces/ModelService';
import { Card } from './card.entity';
import {
  CARD_REPOSITORY,
  CARD_STEP_REPOSITORY,
} from './../../core/constants/index';
import { Inject, Injectable } from '@nestjs/common';
import { ParentModelService } from 'src/core/interfaces/ParentModelService';
import { Op } from 'sequelize';
import { CardStep } from '../card-step/card-step.entity';

@Injectable()
export class CardService
  implements ModelService<Card, CardDto>, ParentModelService<Card>
{
  private includeModel() {
    return {
      model: CardStep,
    };
  }

  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: typeof Card,
    private readonly cardStepService: CardStepService,
  ) {}

  async getAll(userId: number): Promise<Card[]> {
    return await this.cardRepository.findAll({
      where: { userId },
      include: [this.includeModel()],
    });
  }

  async getById(id: number, userId: number): Promise<Card> {
    return await this.cardRepository.findOne({
      where: { id, userId },
      include: [this.includeModel()],
    });
  }

  async create(data: CardDto, userId?: number): Promise<Card> {
    return await this.cardRepository.create({
      ...data,
      userId,
    });
  }

  async update(id: number, data: CardDto, userId?: number): Promise<number> {
    const [numberOfAffectedRows] = await this.cardRepository.update(
      {
        ...data,
      },
      { where: { id, userId } },
    );

    return numberOfAffectedRows;
  }

  async delete(id: number, userId: number): Promise<number> {
    const numberOfAffectedRows = await this.cardRepository.destroy({
      where: { id, userId },
    });

    if (numberOfAffectedRows) {
      // const listImage = this.cardStepService.getByParent(id);
    }

    return numberOfAffectedRows;
  }

  async getAllByParent(id: number): Promise<Card[]> {
    return await this.cardRepository.findAll({
      where: { cardGroupId: id },
      include: [this.includeModel()],
    });
  }

  async deleteAllByParent(id: number, userId: number): Promise<number> {
    const listCard = await this.getAllByParent(id);
    const listIdCard: Array<number> = [];
    for (const card of listCard) {
      listIdCard.push(card.id);
    }

    return await this.cardRepository.destroy({
      where: {
        id: { [Op.in]: listCard },
        userId,
      },
    });
  }
}
