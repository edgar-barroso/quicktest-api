import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { UserModule } from '@/presentation/routes/user/user.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { clearDataBase } from '../utils';

beforeAll(async () => {
  await clearDataBase();
});

afterAll(async () => {
  await clearDataBase();
});

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Configurações globais
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new AuthGuard(app.get(JwtService), reflector));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST user/register - Deve criar um novo usuário', async () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'STUDENT',
    };

    return request(app.getHttpServer())
      .post('/user/register')
      .send(input)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/POST user/register - Deve falhar ao criar um usuário com email já existente', async () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'STUDENT',
    };

    return request(app.getHttpServer())
      .post('/user/register')
      .send(input)
      .expect(409); // Conflito
  });

  it('/POST user/login - Deve autenticar um usuário existente', async () => {
    const input = {
      email: 'johndoe@example.com',
      password: '123456',
    };

    return request(app.getHttpServer())
      .post('/user/login')
      .send(input)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/POST user/login - Deve falhar ao autenticar com credenciais inválidas', async () => {
    const input = {
      email: 'johndoe@example.com',
      password: 'wrongpassword',
    };

    return request(app.getHttpServer())
      .post('/user/login')
      .send(input)
      .expect(401);
  });

  it('/GET user - Deve retornar os detalhes do usuário autenticado', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      });

    const token = loginResponse.body.access_token;
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('email', 'johndoe@example.com');
      });
  });

  it('/PUT user - Deve atualizar os dados do usuário autenticado', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      });

    const token = loginResponse.body.access_token;

    const updateInput = {
      name: 'John Updated',
      email: 'johnupdated@example.com',
    };

    return request(app.getHttpServer())
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(updateInput)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'John Updated');
        expect(res.body).toHaveProperty('email', 'johnupdated@example.com');
      });
  });

  it('/DELETE user - Deve remover o usuário autenticado', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'johnupdated@example.com',
        password: '123456',
      });

    const token = loginResponse.body.access_token;

    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
