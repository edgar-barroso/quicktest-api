import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { AllExceptionsFilter } from './presentation/handler/all-exceptions-filter';
import { AuthGuard } from './presentation/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(app.get(JwtService), reflector));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('QuickTest API')
    .setDescription('API para o sistema de testes rápidos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entre com o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT, '0.0.0.0');
  console.log('Server is running🚀!');
  console.log(`Swagger documentation available at: http://localhost:${env.PORT}/api/docs`);
}
bootstrap();
