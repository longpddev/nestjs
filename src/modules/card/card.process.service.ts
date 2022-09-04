import { getTimeMidnight } from './../../core/helper/function';
import { Op } from 'sequelize';
import { CARD_PROCESS_REPOSITORY } from './../../core/constants/index';
import { CardProcessDto } from './dto/card.process.dto';
import { ParentModelService } from 'src/core/interfaces/ParentModelService';
import { ModelService } from 'src/core/interfaces/ModelService';
import { Inject, Injectable } from '@nestjs/common';
import { CardProcess } from './card.process.entity';
import { getTimeMorning } from 'src/core/helper/function';

@Injectable()
export class CardProcessService
  implements
    ModelService<CardProcess, CardProcessDto>,
    ParentModelService<CardProcess>
{
  constructor(
    @Inject(CARD_PROCESS_REPOSITORY)
    protected readonly cardProcessRepository: typeof CardProcess,
  ) {}
  async getById(id: number) {
    return await this.cardProcessRepository.findOne({
      where: { id },
    });
  }
  async getAll() {
    return await this.cardProcessRepository.findAndCountAll();
  }
  async create(data: CardProcessDto) {
    return await this.cardProcessRepository.create<CardProcess>({ ...data });
  }
  async update(id: number, data: CardProcessDto) {
    const [numberRowEffect] =
      await this.cardProcessRepository.update<CardProcess>(
        { ...data },
        { where: { id } },
      );

    return numberRowEffect;
  }
  async delete(id: number) {
    return await this.cardProcessRepository.destroy({ where: { id } });
  }
  async getAllByParent(id: number) {
    return await this.cardProcessRepository.findAndCountAll({
      where: {
        cardMainId: id,
      },
    });
  }
  async deleteAllByParent(id: number) {
    return await this.cardProcessRepository.destroy({
      where: {
        cardMainId: id,
      },
    });
  }
  async getLearnedToday(groupId: number) {
    return await this.cardProcessRepository.count({
      where: {
        timeLastLearn: {
          [Op.gte]: getTimeMorning(),
        },
        timeNextLearn: {
          [Op.gt]: getTimeMidnight(),
        },
        cardGroupId: groupId,
      },
    });
  }
  async getLearnToday(
    groupId: number,
    limitCard: number,
  ): Promise<{ rows: CardProcess[]; count: number }> {
    const count = await this.getLearnedToday(groupId);
    const remain = limitCard - count;

    return await this.cardProcessRepository.findAndCountAll({
      where: {
        cardGroupId: groupId,
        timeNextLearn: {
          [Op.lte]: new Date(),
        },
        times: {
          [Op.lte]: 5,
        },
      },
      limit: remain > 0 ? remain : 0,
      order: [['timeNextLearn', 'DESC']],
    });
  }

  async markLearned(id, isHard) {
    let { times } = await this.cardProcessRepository.findOne({
      where: {
        id,
      },
      attributes: ['times'],
    });

    if (!isHard || times === 0) {
      times++;
    }

    const [numberRowEffect] = await this.cardProcessRepository.update(
      {
        timeNextLearn: this.calculatorNextLean(times),
        timeLastLearn: new Date(),
        times,
      },
      {
        where: { id },
      },
    );

    return numberRowEffect;
  }

  calculatorNextLean(times): Date {
    const nextToday = (day: number) =>
      new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
    // follow time: 0: current; 1: 1d; 2: 3d; 3: 7d; 4: 16d; 5: 35d
    // 1: next day; 2: next 2 day; 3: next 4 day; 4: next 9day; 5: next 19 day
    const caseOb = {
      0: new Date(),
      1: nextToday(1),
      2: nextToday(2),
      3: nextToday(4),
      4: nextToday(9),
      5: nextToday(19),
    };

    return caseOb[times];
  }
}
