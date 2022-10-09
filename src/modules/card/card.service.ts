import { CardProcessService } from './card.process.service';
import { CARD_STEP_TYPE } from 'src/core/constants';
import { CardStepService } from './../card-step/card-step.service';
import { CardDto } from './dto/card.dto';
import { ModelService } from 'src/core/interfaces/ModelService';
import { Card } from './card.entity';
import { faker } from '@faker-js/faker';

import {
  CARD_REPOSITORY,
  CARD_STEP_REPOSITORY,
} from './../../core/constants/index';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ParentModelService } from 'src/core/interfaces/ParentModelService';
import { Op, WhereOptions } from 'sequelize';
import { CardStep } from '../card-step/card-step.entity';
import { ImageService } from '../image/image.service';
import { CardStepDto } from '../card-step/dto/card-step.dto';
import { QueryOptions } from 'src/core/interfaces/common';
import { ModelStatic } from 'sequelize-typescript';

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
    private readonly imageService: ImageService,
    private readonly cardProcessService: CardProcessService,
  ) {}

  async getAll(
    userId: number,
    options?: QueryOptions,
  ): Promise<{ rows: Card[]; count: number }> {
    const query: { limit?: number; offset?: number } = {};

    if (options) {
      query.limit = options.limit;
      query.offset = options.pageIndex;
    }
    return await this.cardRepository.findAndCountAll({
      where: { userId },
      ...query,
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

  async createCard(
    userId: number,
    info: CardDto,
    cardQuestion: CardStepDto,
    cardAnswer: CardStepDto,
    cardExplain?: CardStepDto,
  ) {
    const createError = (field, type) => {
      throw new NotAcceptableException(
        `field type in ${field} must be ${type}`,
      );
    };

    const card = await this.create(info, userId);
    if (!card) throw new NotFoundException("can't create card");
    cardQuestion.cardId = card.id;
    cardAnswer.cardId = card.id;
    cardExplain && (cardExplain.cardId = card.id);

    if (cardQuestion.type !== CARD_STEP_TYPE.question)
      createError('cardQuestion', CARD_STEP_TYPE.question);
    if (cardAnswer.type !== CARD_STEP_TYPE.answer)
      createError('cardAnswer', CARD_STEP_TYPE.answer);
    if (cardExplain && cardExplain.type !== CARD_STEP_TYPE.explain)
      createError('cardExplain', CARD_STEP_TYPE.explain);

    try {
      if (cardExplain) {
        const [rowQuestion, rowAnswer, rowExplain] = await Promise.all([
          this.cardStepService.create(cardQuestion),
          this.cardStepService.create(cardAnswer),
          this.cardStepService.create(cardExplain),
        ]);

        await Promise.all([
          this.cardProcessService.create({
            frontCardId: rowQuestion.id,
            backCardId: rowAnswer.id,
            times: 0,
            timeLastLearn: new Date(),
            timeNextLearn: new Date(),
            cardMainId: card.id,
            cardGroupId: info.cardGroupId,
          }),
          this.cardProcessService.create({
            frontCardId: rowAnswer.id,
            backCardId: rowExplain.id,
            times: 0,
            timeLastLearn: new Date(),
            timeNextLearn: new Date(),
            cardMainId: card.id,
            cardGroupId: info.cardGroupId,
          }),
        ]);
      } else {
        const [rowQuestion, rowAnswer] = await Promise.all([
          this.cardStepService.create(cardQuestion),
          this.cardStepService.create(cardAnswer),
        ]);

        await Promise.all([
          this.cardProcessService.create({
            frontCardId: rowQuestion.id,
            backCardId: rowAnswer.id,
            times: 0,
            timeLastLearn: new Date(),
            timeNextLearn: new Date(),
            cardMainId: card.id,
            cardGroupId: info.cardGroupId,
          }),
        ]);
      }
    } catch (e) {
      throw e;
    }

    return card;
  }

  async delete(id: number): Promise<number> {
    await this.cardProcessService.deleteAllByParent(id);
    await this.cardStepService.deleteAllByParent(id);
    const numberOfAffectedRows = await this.cardRepository.destroy({
      where: { id },
    });

    return numberOfAffectedRows;
  }

  async getAllByParent(
    id: number,
    userId: number,
    options?: QueryOptions,
  ): Promise<{
    rows: Card[];
    count: number;
  }> {
    const query: { limit?: number; offset?: number } = {};

    if (options) {
      query.limit = options.limit;
      query.offset = (options.pageIndex - 1) * query.limit;
    }

    const [count, rows] = await Promise.all([
      this.cardRepository.count({
        where: { cardGroupId: id, userId: userId },
        group: ['id'],
        ...query,
      }),
      this.cardRepository.findAll({
        where: { cardGroupId: id, userId: userId },
        ...query,
        include: [this.includeModel()],
      }),
    ]);

    return Promise.resolve({
      rows,
      count: count.length,
    });
  }

  async deleteAllByParent(id: number, userId: number): Promise<number> {
    const { rows: listCard } = await this.getAllByParent(id, userId);
    const listIdCard = [];
    for (const card of listCard) {
      listIdCard.push(card.id);
    }
    return (await Promise.all(listIdCard.map((id) => this.delete(id)))).length;
    // return await this.cardRepository.destroy({
    //   where: {
    //     id: { [Op.in]: listIdCard },
    //     userId,
    //   },
    // });
  }

  async fakeData(groupId: number, userId: number) {
    const info: CardDto = {
      cardGroupId: groupId,
    };

    const createCardData = async (type: string) => {
      const urlImage = faker.image.image(400, 300, true);
      const urlParseImage = new URL(urlImage);

      const result = await this.imageService.create({
        name: urlParseImage.pathname.replace(/^.*\//, ''),
        path: urlImage,
        width: 400,
        height: 300,
      });

      return {
        imageId: result.id,
        content: faker.lorem.sentences(),
        type,
        cardGroupId: groupId,
        cardId: 1,
      };
    };
    const cardQuestion = await createCardData(CARD_STEP_TYPE.question);
    const cardAnswer = await createCardData(CARD_STEP_TYPE.answer);
    const cardExplain = await createCardData(CARD_STEP_TYPE.explain);
    const createError = (field, type) => {
      throw new NotAcceptableException(
        `field type in ${field} must be ${type}`,
      );
    };

    const card = await this.create(info, userId);
    if (!card) throw new NotFoundException("can't create card");
    cardQuestion.cardId = card.id;
    cardAnswer.cardId = card.id;
    cardExplain.cardId = card.id;

    if (cardQuestion.type !== CARD_STEP_TYPE.question)
      createError('cardQuestion', CARD_STEP_TYPE.question);
    if (cardAnswer.type !== CARD_STEP_TYPE.answer)
      createError('cardAnswer', CARD_STEP_TYPE.answer);
    if (cardExplain.type !== CARD_STEP_TYPE.explain)
      createError('cardExplain', CARD_STEP_TYPE.explain);

    try {
      const [rowQuestion, rowAnswer, rowExplain] = await Promise.all([
        this.cardStepService.create(cardQuestion),
        this.cardStepService.create(cardAnswer),
        this.cardStepService.create(cardExplain),
      ]);

      await Promise.all([
        this.cardProcessService.create({
          frontCardId: rowQuestion.id,
          backCardId: rowAnswer.id,
          times: 0,
          timeLastLearn: new Date(),
          timeNextLearn: new Date(),
          cardMainId: card.id,
          cardGroupId: groupId,
        }),
        this.cardProcessService.create({
          frontCardId: rowAnswer.id,
          backCardId: rowExplain.id,
          times: 0,
          timeLastLearn: new Date(),
          timeNextLearn: new Date(),
          cardMainId: card.id,
          cardGroupId: groupId,
        }),
      ]);
    } catch (e) {
      throw e;
    }

    return card;
  }
}
