import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationException } from 'src/core/exceptions/validation.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from 'src/core/filters/global.filter';
import * as express from 'express';
import * as cookieparser from 'cookie-parser';
// import { AuthModule } from './api/auth/auth.module';
// import { AuthGuard } from './api/auth/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  const allowedOrigins = [
    'http://localhost:3000',
    'https://glistening-achiever-rotten-shock-production.pipeops.app',
    'https://frontend-4cx6.onrender.com',
    'https://bdmeds-frontend.onrender.com',
  ];
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));
  app.use(cookieparser());
  app.disable('x-powered-by');

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory(errors) {
        return new ValidationException(errors);
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  //   const authGuard = app.select(AuthModule).get(AuthGuard);
  //   app.useGlobalGuards(authGuard);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Digifest API')
    .setDescription('Digifest API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/v1/docs', app, swaggerDoc, { useGlobalPrefix: true });

  app.use('/api/v1/health-check', (_, res: express.Response) => {
    res.json({ status: 'OK' });
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;

  await app.listen(PORT);
}
bootstrap();
