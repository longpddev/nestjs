import { IsNotEmpty, IsNumber } from 'class-validator';

export class CardProcessDto {
  @IsNotEmpty()
  timeLastLearn: Date;

  @IsNotEmpty()
  timeNextLearn: Date;

  @IsNotEmpty()
  @IsNumber()
  times: number;

  @IsNotEmpty()
  @IsNumber()
  frontCardId: number;

  @IsNotEmpty()
  @IsNumber()
  backCardId: number;

  @IsNotEmpty()
  @IsNumber()
  cardMainId: number;

  @IsNotEmpty()
  @IsNumber()
  cardGroupId: number;
}
