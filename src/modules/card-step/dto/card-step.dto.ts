import { IsNotEmpty } from 'class-validator';

export class CardStepDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: string;
}
