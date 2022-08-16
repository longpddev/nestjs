import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class Image extends Model<Image> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  width: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  height: number;
}
