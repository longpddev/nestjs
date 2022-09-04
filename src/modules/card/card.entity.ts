import { CardGroup } from './../card-group/card-group.entity';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
  DefaultScope,
} from 'sequelize-typescript';
import { CardStep } from '../card-step/card-step.entity';
import { User } from '../users/users.entity';
@DefaultScope(() => ({
  include: {
    model: CardStep,
  },
}))
@Table
export class Card extends Model<Card> {
  @ForeignKey(() => CardGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cardGroupId: number;

  @HasMany(() => CardStep, 'cardId')
  cardStep: CardStep[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
