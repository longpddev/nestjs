import { CardService } from './../card/card.service';
import { CardGroupDto } from './dto/card-group.dto';
import { CARD_GROUP_REPOSITORY } from './../../core/constants/index';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CardGroup } from './card-group.entity';
import { Card } from '../card/card.entity';
import { ModelService } from 'src/core/interfaces/ModelService';

@Injectable()
export class CardGroupService implements ModelService<CardGroup, CardGroupDto> {
  constructor(
    @Inject(CARD_GROUP_REPOSITORY)
    private readonly cardGroupRepository: typeof CardGroup,
    private readonly cardService: CardService,
  ) {}

  async getById(id: number, userId: number) {
    return await this.cardGroupRepository.findOne({
      where: { id, userId },
    });
  }

  async getAll(userId: number) {
    return await this.cardGroupRepository.findAndCountAll({
      where: { userId },
    });
  }

  async create(data: CardGroupDto, userId: number) {
    return await this.cardGroupRepository.create<CardGroup>({
      userId,
      ...data,
    });
  }

  async update(id: number, cardDetail: CardGroupDto, userId: number) {
    const [affectedCount] = await this.cardGroupRepository.update<CardGroup>(
      { ...cardDetail },
      {
        where: { userId, id },
      },
    );

    return affectedCount;
  }

  async delete(id: number, userId: number) {
    const cardGroup = await this.getById(id, userId);
    if (!cardGroup)
      throw new NotFoundException("This card group doesn't exits");

    const result = await this.cardGroupRepository.destroy({ where: { id } });
    console.log({ result });
    if (result > 0) {
      const listCard = await this.cardService.deleteAllByParent(id, userId);
    }
    return result;
  }
}
