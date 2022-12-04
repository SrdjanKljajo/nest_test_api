import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(compression());
  app.use(helmet());
  app.enableCors();
  app.use(morgan('tiny'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configSwg = new DocumentBuilder()
    .setTitle('Nest starter')
    .setDescription('Building nest starter api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwg);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Nest start' });

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(4444);
}
bootstrap();
