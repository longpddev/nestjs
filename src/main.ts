import { join } from 'path';
import { FormatResponse } from './core/interceptor/FormatResponse.interceptor';
import { ValidateInputPipe } from './core/pipes/validator.pite';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'), {
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
