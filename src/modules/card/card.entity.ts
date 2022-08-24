import { CardGroup } from './../card-group/card-group.entity';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { CardStep } from '../card-step/card-step.entity';
import { User } from '../users/users.entity';

@Table
export class Card extends Model<Card> {
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  timeLastLearn: string;
  @Column({
    type: DataType.INTEGER,
    values: ['0', '1', '2', '3', '4', '5'],
    allowNull: false,
  })
  times: number;

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
