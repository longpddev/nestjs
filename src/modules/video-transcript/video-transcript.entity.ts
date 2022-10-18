import { VideoMetadataDto } from './dto/video-metadata.dto';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  DefaultScope,
} from 'sequelize-typescript';
import { Image } from '../image/image.entity';
import { User } from '../users/users.entity';

@DefaultScope(() => ({
  include: {
    model: Image,
  },
}))
@Table
export class VideoTranscript extends Model<VideoTranscript> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

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
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  thumbnailId: number;

  @BelongsTo(() => Image)
  thumbnail: Image;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  width: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  height: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  metadata: VideoMetadataDto;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  transcript: string;
}
