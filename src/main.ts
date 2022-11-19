import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const session = require('cookie-session');

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');

  app.setGlobalPrefix('api');
  app.use(
    session({
      keys: [configService.get<string>('KEY_COOKIE')],
    }),
  );

  await app.listen(port);
}
bootstrap();
