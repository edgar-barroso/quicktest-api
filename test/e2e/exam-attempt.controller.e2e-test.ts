import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { ExamAttemptModule } from '@/presentation/routes/exam-attempt/exam-attempt.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { BcryptHashStrategy } from '@/domain/service/hashStrategy/BcryptHashStrategy';
import { env } from '@/env';
import { Question as QuestionPrisma } from '@prisma/client';
import { clearDataBase } from './../utils';

let app: INestApplication;
let token: string;
let studentToken: string;
let examId: string;
let examAttemptId: string;
let question:QuestionPrisma;

beforeAll(async () => {
  await clearDataBase()

  const passwordHash = await new BcryptHashStrategy().hash('123456');

  const teacher = await prisma.user.create({
    data: {
      name: 'Teacher',
      email: 'teacher@example.com',
      passwordHash,
      role: 'TEACHER',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Student',
      email: 'student@example.com',
      passwordHash,
      role: 'STUDENT',
    },
  });

  const jwtService = new JwtService({
    secret: env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '7d' },
  });

  token = await jwtService.signAsync({ sub: teacher.id, email: teacher.email });
  studentToken = await jwtService.signAsync({
    sub: student.id,
    email: student.email,
  });

  const classEntity = await prisma.class.create({
    data: {
      title: 'Math Class',
      teacherId: teacher.id, 
    },
  });


  question = await prisma.question.create({
    data: {
      description: 'A simple math question',
      authorId: teacher.id,
    },
  });

  await prisma.choice.createMany({
    data: [
      { id:"choice-1",text: '4', isCorrect: true, questionId: question.id },
      { id:"choice-2",text: '5', isCorrect: false, questionId: question.id },
    ],
  });

    examId = (
      await prisma.exam.create({
        data: {
          title: 'Math Exam',
          description: 'A simple math exam',
          authorId: teacher.id,
          classId: classEntity.id, 
          openDate: new Date(),
          closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24), 
          questions:{connect:{id: question.id}}
        },
      })
    ).id;

  const moduleRef = await Test.createTestingModule({
    imports: [ExamAttemptModule],
  }).compile();

  app = moduleRef.createNestApplication();
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
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

describe('ExamAttemptController (e2e)', () => {
  it('/POST exam-attempt - Deve criar uma tentativa de exame', async () => {
    const input = { examId };

    const response = await request(app.getHttpServer())
      .post('/exam-attempt')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(input)
      .expect(201);

        
    expect(response.body).toHaveProperty('id', expect.any(String));
    examAttemptId = response.body.id;
  });

  it('/GET exam-attempt/:id - Deve retornar os detalhes de uma tentativa de exame', async () => {
    const response = await request(app.getHttpServer())
      .get(`/exam-attempt/${examAttemptId}`)
      .set('Authorization', `Bearer ${studentToken}`)

      

    expect(response.body).toHaveProperty('id', examAttemptId);
    expect(response.body).toHaveProperty('examId', examId);
  });

  it('/POST exam-attempt/:id/grade - Deve avaliar uma tentativa de exame', async () => {
    const response = await request(app.getHttpServer())
      .post(`/exam-attempt/${examAttemptId}/grade`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('score');
    expect(response.body.score).toBeGreaterThanOrEqual(0);
  });
});
