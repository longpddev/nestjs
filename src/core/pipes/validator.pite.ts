import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        console.log(e);
        throw new UnprocessableEntityException(e.message);
      }
    }
  }
}
