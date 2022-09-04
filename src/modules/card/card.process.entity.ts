import { CardGroup } from 'src/modules/card-group/card-group.entity';
import { CardStep } from '../card-step/card-step.entity';
import {
  Column,
  DefaultScope,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { Card } from './card.entity';

@DefaultScope(() => ({
  include: [
    {
      model: CardStep,
      as: 'frontCard',
    },
    {
      model: CardStep,
      as: 'backCard',
    },
  ],
}))
@Table
export class CardProcess extends Model<CardProcess> {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timeLastLearn: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timeNextLearn: Date;

  @Column({
    type: DataType.INTEGER,
    values: ['0', '1', '2', '3', '4', '5'],
    allowNull: false,
  })
  times: number;

  @ForeignKey(() => CardStep)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  frontCardId: number;

  @BelongsTo(() => CardStep, {
    foreignKey: 'frontCardId',
    as: 'frontCard',
  })
  frontCard: CardStep;

  @ForeignKey(() => CardStep)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  backCardId: number;

  @BelongsTo(() => CardStep, {
    foreignKey: 'backCardId',
    as: 'backCard',
  })
  backCard: CardStep;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cardMainId: number;

  @ForeignKey(() => CardGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cardGroupId: number;
}
