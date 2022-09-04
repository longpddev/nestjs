import { SettingsUser } from './dto/settings.user.dto';
import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    values: ['male', 'female'],
    allowNull: true,
  })
  gender: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  settings: SettingsUser;
}
