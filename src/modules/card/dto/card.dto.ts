import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CardDto {
  @IsNotEmpty()
  @IsNumber()
  cardGroupId: number;

  @IsDate()
  timeLastLearn: string;

  @IsNotEmpty()
  @IsNumber()
  times: number;
}
