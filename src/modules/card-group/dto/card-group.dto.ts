import { IsNotEmpty, MinLength } from 'class-validator';

export class CardGroupDto {
  @IsNotEmpty()
  name: string;
  description: string;
}
