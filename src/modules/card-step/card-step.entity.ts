import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Card } from '../card/card.entity';
import { Image } from '../image/image.entity';

@Table
export class CardStep extends Model<CardStep> {
  @ForeignKey(() => Image)
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  imageId: number;

  @BelongsTo(() => Image)
  image: Image;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cardId: number;

  @Column({
    type: DataType.STRING,
    values: ['question', 'answer', 'explain'],
    allowNull: false,
  })
  type: string;
}
