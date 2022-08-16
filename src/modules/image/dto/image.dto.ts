import { IsNotEmpty } from 'class-validator';

export class ImageDto {
  @IsNotEmpty()
  readonly path: string;

  @IsNotEmpty()
  readonly name: string;

  readonly width: number;

  readonly height: number;
}
