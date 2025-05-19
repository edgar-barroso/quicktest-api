import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { QuestionModule } from '@/presentation/routes/question/question.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { BcryptHashStrategy } from '@/domain/service/hashStrategy/BcryptHashStrategy';
import { env } from '@/env';
import { clearDataBase } from '../utils';

let token: string;
let jwtService: JwtService;
let reflector = new Reflector();

describe('QuestionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await clearDataBase();
    const passwordHash = new BcryptHashStrategy().hash('123456');
    const user = await prisma.user.create({
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
    reflector = new Reflector();
    token = await jwtService.signAsync({ sub: user.id, email: user.email });
    const moduleRef = await Test.createTestingModule({
      imports: [QuestionModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalGuards(new AuthGuard(jwtService, reflector));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Remove campos não definidos no DTO
        forbidNonWhitelisted: true, // Lança erro para campos não permitidos
        transform: true, // Transforma os tipos automaticamente (ex.: string para number)
      }),
    );

    await app.init();
  });
  afterEach(async () => {
    await clearDataBase();
  });

  it('/POST question - Deve criar uma nova questão', async () => {
    const input = {
      description: 'A simple math question',
      choices: [
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false },
      ],
    };
    return request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send(input)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty(
          'description',
          'A simple math question',
        );
        expect(res.body.choices).toEqual([
          { id: expect.any(String), text: '4', isCorrect: true },
          { id: expect.any(String), text: '5', isCorrect: false },
        ]);
      });
  });

  it('/GET question/:id - Deve retornar os detalhes de uma questão', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'A simple science question',
        choices: [
          { text: 'Water', isCorrect: true },
          { text: 'Oxygen', isCorrect: false },
        ],
      });

    const questionId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/question/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty(
          'description',
          'A simple science question',
        );
        expect(res.body.choices).toEqual([
          { id: expect.any(String), text: 'Water', isCorrect: true },
          { id: expect.any(String), text: 'Oxygen', isCorrect: false },
        ]);
      });
  });

  it('/GET question - Deve retornar uma lista de questões', async () => {
    await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'A simple math question',
        choices: [
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
        ],
      });

    await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'A simple science question',
        choices: [
          { text: 'Water', isCorrect: true },
          { text: 'Oxygen', isCorrect: false },
        ],
      });

    const response = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, pageLength: 10 })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('questions');
        expect(res.body.questions).toBeInstanceOf(Array);
        expect(res.body.questions[0]).toHaveProperty('id');
        expect(res.body.questions).toHaveLength(2);
        expect(res.body.questions[0]).toHaveProperty('description');
        expect(res.body.questions[0]).toHaveProperty('choices');
        expect(res.body.questions[0].choices).toBeInstanceOf(Array);
      });
  });

  it('/PUT question/:id - Deve atualizar uma questão existente', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'A simple history question',
        choices: [
          { text: 'Christopher Columbus', isCorrect: true },
          { text: 'Vasco da Gama', isCorrect: false },
        ],
      });

    const questionId = createResponse.body.id;

    const updateInput = {
      description: 'A simple history question',
      choices: [
        { text: 'Christopher Columbus', isCorrect: true },
        { text: 'Leif Erikson', isCorrect: false },
      ],
    };

    return request(app.getHttpServer())
      .put(`/question/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateInput)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', questionId);
        expect(res.body).toHaveProperty(
          'description',
          'A simple history question',
        );
      });
  });

  it('/DELETE question/:id - Deve remover uma questão existente', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'A simple geography question',
        choices: [
          { text: 'Paris', isCorrect: true },
          { text: 'London', isCorrect: false },
        ],
      });

    const questionId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/question/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', questionId);
      });
  });
});
