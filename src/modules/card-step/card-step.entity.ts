import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  DefaultScope,
} from 'sequelize-typescript';
import { CARD_STEP_TYPE } from 'src/core/constants';
import { Card } from '../card/card.entity';
import { Image } from '../image/image.entity';

// alway load association model image
@DefaultScope(() => ({
  include: {
    model: Image,
  },
}))
@Table
export class CardStep extends Model<CardStep> {
  @ForeignKey(() => Image)
  @Column({
    type: DataType.INTEGER,
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
    values: Object.values(CARD_STEP_TYPE),
    allowNull: false,
  })
  type: string;
}
