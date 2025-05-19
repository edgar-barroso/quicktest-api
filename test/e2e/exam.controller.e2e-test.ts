import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { ExamModule } from '@/presentation/routes/exam/exam.module';
import { ClassModule } from '@/presentation/routes/class/class.module';
import { QuestionModule } from '@/presentation/routes/question/question.module';
import { UserModule } from '@/presentation/routes/user/user.module';
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
let app: INestApplication;
let teacherId: string;
let classId: string;
let questionId: string;
let examId: string;

beforeAll(async () => {
  await clearDataBase();

  // Cria usuário professor
  const passwordHash = new BcryptHashStrategy().hash('123456');
  const teacher = await prisma.user.create({
    data: {
      name: 'Teacher Test',
      email: 'teacher@example.com',
      passwordHash,
      role: 'TEACHER',
    },
  });

  teacherId = teacher.id;

  jwtService = new JwtService({
    secret: env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '7d' },
  });
  token = await jwtService.signAsync({ sub: teacher.id, email: teacher.email });

  const classData = await prisma.class.create({
    data: {
      title: 'Class Test',
      teacherId: teacher.id,
    },
  });
  classId = classData.id;
  // Cria uma questão
  const question = await prisma.question.create({
    data: {
      description: 'What is 2+2?',
      choices: {
        create: [
          { text: '4', isCorrect: true },
          { text: '3', isCorrect: false },
        ],
      },
      authorId: teacher.id,
    },
    include: { choices: true },
  });
  questionId = question.id;

  // Inicializa o app
  const moduleRef = await Test.createTestingModule({
    imports: [ExamModule, ClassModule, QuestionModule, UserModule],
  }).compile();

  app = moduleRef.createNestApplication();
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(app.get(JwtService), reflector));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
});

afterAll(async () => {
  await clearDataBase()
});

describe('ExamController (e2e)', () => {
  it('POST /exam - cria um exame', async () => {
    return request(app.getHttpServer())
      .post('/exam')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Prova de Matemática',
        description: 'Exame sobre operações básicas',
        questionsIds: [questionId],
        classId,
        openDate: new Date().toISOString(),
        closeDate: new Date(Date.now() + 86400000).toISOString(),
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        examId = res.body.id;
      });
  });

  it('GET /exam/:id - busca exame por id', async () => {
    return request(app.getHttpServer())
      .get(`/exam/${examId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', examId);
        expect(res.body).toHaveProperty('title', 'Prova de Matemática');
      });
  });

  it('GET /exam - lista exames', async () => {
    return request(app.getHttpServer())
      .get('/exam')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.exams)).toBe(true);
        expect(res.body.exams.some((e: any) => e.id === examId)).toBe(true);
      });
  });

  it('PUT /exam/:id - atualiza exame', async () => {
    return request(app.getHttpServer())
      .put(`/exam/${examId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Prova Atualizada' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', examId);
        expect(res.body).toHaveProperty('title', 'Prova Atualizada');
      });
  });

  it('DELETE /exam/:id - remove exame', async () => {
    return request(app.getHttpServer())
      .delete(`/exam/${examId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', examId);
      });
  });
});
