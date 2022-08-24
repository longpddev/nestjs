import { CARD_STEP_TYPE } from './../../../core/constants/index';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CardStepDto {
  @IsNotEmpty()
  imageId: number;
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @Matches(`^(${Object.values(CARD_STEP_TYPE).join('|')})$`)
  type: string;

  cardId: number;
}
