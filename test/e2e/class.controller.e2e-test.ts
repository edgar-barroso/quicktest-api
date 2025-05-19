import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { ClassModule } from '@/presentation/routes/class/class.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { BcryptHashStrategy } from '@/domain/service/hashStrategy/BcryptHashStrategy';
import { env } from '@/env';
import { clearDataBase } from './../utils';

let token: string;
let jwtService: JwtService;

describe('ClassController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await clearDataBase()

    const passwordHash = new BcryptHashStrategy().hash('123456');
    const teacher = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        passwordHash,
        role: 'TEACHER',
      },
    });

    jwtService = new JwtService({
      secret: env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '7d',
      },
    });

    token = await jwtService.signAsync({ sub: teacher.id, email: teacher.email });

    const moduleRef = await Test.createTestingModule({
      imports: [ClassModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalGuards(new AuthGuard(jwtService, app.get(Reflector)));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await clearDataBase()
    await app.close();
  });

  it('/POST class - Deve criar uma nova turma', async () => {
    const input = {
      title: 'Math Class',
    };

    return request(app.getHttpServer())
      .post('/class')
      .set('Authorization', `Bearer ${token}`)
      .send(input)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', 'Math Class');
        expect(res.body).toHaveProperty('teacherId');
      });
  });

  it('/GET class/:id - Deve retornar os detalhes de uma turma', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/class')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Science Class',
      });

    const classId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/class/${classId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', classId);
        expect(res.body).toHaveProperty('title', 'Science Class');
        expect(res.body).toHaveProperty('teacherId');
      });
  });

  it('/GET class - Deve retornar uma lista de turmas', async () => {
    await request(app.getHttpServer())
      .post('/class')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'History Class',
      });

    const response = await request(app.getHttpServer())
      .get('/class')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, pageLength: 10 })
      .expect(200);

    expect(response.body).toHaveProperty('classes');
    expect(response.body.classes).toBeInstanceOf(Array);
    expect(response.body.classes.length).toBeGreaterThanOrEqual(1);
    expect(response.body.classes[0]).toHaveProperty('id');
    expect(response.body.classes[0]).toHaveProperty('title');
    expect(response.body.classes[0]).toHaveProperty('teacherId');
  });

  it('/DELETE class/:id - Deve remover uma turma existente', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/class')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Geography Class',
      });

    const classId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/class/${classId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', classId);
      });
  });
});