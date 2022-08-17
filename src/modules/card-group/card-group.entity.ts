import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from '../card/card.entity';
import { User } from '../users/users.entity';

@Table
export class CardGroup extends Model<CardGroup> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  userId: number;
}
