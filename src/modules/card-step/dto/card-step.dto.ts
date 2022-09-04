import { CARD_STEP_TYPE } from './../../../core/constants/index';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CardStepDto {
  imageId: number;
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @Matches(`^(${Object.values(CARD_STEP_TYPE).join('|')})$`)
  type: string;

  @IsNotEmpty()
  cardGroupId: number;

  cardId: number;
}
