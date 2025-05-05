/* eslint-disable @typescript-eslint/no-unsafe-return */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    '/',
    (
      req: { path: string },
      res: { redirect: (arg0: string) => any },
      next: () => void,
    ) => {
      if (req.path === '/') {
        return res.redirect('/api-docs');
      }
      next();
    },
  );
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Evaluaciones 360° API')
    .setDescription('Sistema de evaluaciones de desempeño')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT (No incluir "Bearer".)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'API Evaluaciones 360°',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 2999);
}
bootstrap();
