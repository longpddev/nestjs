import { CardStepDto } from './../../card-step/dto/card-step.dto';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardDto {
  @IsNotEmpty()
  cardGroupId: number;
}
