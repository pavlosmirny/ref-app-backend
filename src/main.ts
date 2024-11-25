import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включение CORS для локальной разработки и продакшена
  app.enableCors({
    origin: [
      'http://localhost:3000', // Локальный фронтенд
      'https://pavlosmirny.github.io/ref-app/', // Замени на адрес фронтенда на GitHub Pages
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('API для управления пользователями')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
