import { join } from 'path';
import { FormatResponse } from './core/interceptor/FormatResponse.interceptor';
import { ValidateInputPipe } from './core/pipes/validator.pite';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PUBLIC_FOLDER, ROOT_PATH } from './core/constants';
async function bootstrap() {
  ROOT_PATH.path = join(__dirname, '..');
  Object.freeze(ROOT_PATH);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(ROOT_PATH.path, '..', PUBLIC_FOLDER), {
    prefix: '/public/',
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidateInputPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new FormatResponse());

  await app.listen(6969);
}
bootstrap();
