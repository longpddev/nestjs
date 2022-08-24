import { IsNotEmpty } from 'class-validator';

export class FileTempDto {
  @IsNotEmpty()
  url: string;
}
