import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { AllExceptionsFilter } from './presentation/handler/all-exceptions-filter';
import { AuthGuard } from './presentation/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(app.get(JwtService), reflector));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos não definidos no DTO
      forbidNonWhitelisted: true, // Lança erro para campos não permitidos
      transform: true, // Transforma os tipos automaticamente (ex.: string para number)
    }),
  );
  await app.listen(env.PORT, '0.0.0.0');
  console.log('Server is running🚀!');
}
bootstrap();
