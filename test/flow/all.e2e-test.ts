import { prisma } from '@/lib/prisma';
import { AuthGuard } from '@/presentation/auth/auth.guard';
import { AllExceptionsFilter } from '@/presentation/handler/all-exceptions-filter';
import { ClassModule } from '@/presentation/routes/class/class.module';
import { ExamModule } from '@/presentation/routes/exam/exam.module';
import { ExamAttemptModule } from '@/presentation/routes/exam-attempt/exam-attempt.module';
import { QuestionModule } from '@/presentation/routes/question/question.module';
import { UserModule } from '@/presentation/routes/user/user.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { clearDataBase } from '../utils';

describe('Full Application Flow (e2e)', () => {
  let app: INestApplication;
  let teacherToken: string;
  let studentToken: string;
  let classId: string;
  let questionId: string;
  let examId: string;
  let examAttemptId: string;

  beforeAll(async () => {
    await clearDataBase();

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        ClassModule,
        QuestionModule,
        ExamModule,
        ExamAttemptModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    // Configurações globais
    const reflector = app.get(Reflector);
    const jwtService = app.get(JwtService);
    app.useGlobalGuards(new AuthGuard(jwtService, reflector));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await clearDataBase();
    await app.close();
  });

  it('should complete the full application flow', async () => {
    // 1. Registrar um professor
    const teacherRegisterResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'Professor Test',
        email: 'professor@example.com',
        password: '123456',
        role: 'TEACHER',
      })
      .expect(201);

    teacherToken = teacherRegisterResponse.body.access_token;

    // 2. Registrar um estudante
    const studentRegisterResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'Estudante Test',
        email: 'student@example.com',
        password: '123456',
        role: 'STUDENT',
      })
      .expect(201);

    studentToken = studentRegisterResponse.body.access_token;

    // 3. Criar uma turma (como professor)
    const classResponse = await request(app.getHttpServer())
      .post('/class')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        title: 'Turma de Matemática Avançada',
      })
      .expect(201);

    classId = classResponse.body.id;

    // 4. Criar uma questão (como professor)
    const questionResponse = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        description: 'Qual é a derivada de x²?',
        choices: [
          { text: '2x', isCorrect: true },
          { text: 'x', isCorrect: false },
          { text: '2', isCorrect: false },
          { text: 'x²', isCorrect: false },
        ],
      })
      .expect(201);

    questionId = questionResponse.body.id;

    // 5. Criar um exame (como professor)
    const examResponse = await request(app.getHttpServer())
      .post('/exam')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        title: 'Exame de Cálculo I',
        description: 'Primeiro exame do semestre',
        questionsIds: [questionId],
        classId: classId,
        openDate: new Date().toISOString(),
        closeDate: new Date(Date.now() + 86400000).toISOString(), // 1 dia no futuro
      })
      .expect(201);

    examId = examResponse.body.id;

    // 6. Estudante realiza tentativa de exame
    const examAttemptResponse = await request(app.getHttpServer())
      .post('/exam-attempt')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        examId: examId,
      })
      .expect(201);

    examAttemptId = examAttemptResponse.body.id;

    // 7. Professor avalia a tentativa
    const gradeResponse = await request(app.getHttpServer())
      .post(`/exam-attempt/${examAttemptId}/grade`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(200);

    expect(gradeResponse.body).toHaveProperty('score');
    expect(gradeResponse.body.score).toBeGreaterThanOrEqual(0);

    // 8. Verificar detalhes da tentativa (como estudante)
    const attemptDetailsResponse = await request(app.getHttpServer())
      .get(`/exam-attempt/${examAttemptId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(attemptDetailsResponse.body).toHaveProperty('id', examAttemptId);
    expect(attemptDetailsResponse.body).toHaveProperty('examId', examId);

    // 9. Verificar detalhes do exame (como professor)
    const examDetailsResponse = await request(app.getHttpServer())
      .get(`/exam/${examId}`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(200);

    expect(examDetailsResponse.body).toHaveProperty('id', examId);
    expect(examDetailsResponse.body).toHaveProperty(
      'title',
      'Exame de Cálculo I',
    );

    // 10. Verificar lista de questões (como professor)
    const questionsListResponse = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${teacherToken}`)
      .query({ page: 1, pageLength: 10 })
      .expect(200);

    expect(questionsListResponse.body.questions).toBeInstanceOf(Array);
    expect(questionsListResponse.body.questions.length).toBeGreaterThanOrEqual(
      1,
    );

    // 11. Verificar detalhes da turma (como professor)
    const classDetailsResponse = await request(app.getHttpServer())
      .get(`/class/${classId}`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(200);

    expect(classDetailsResponse.body).toHaveProperty('id', classId);
    expect(classDetailsResponse.body).toHaveProperty(
      'title',
      'Turma de Matemática Avançada',
    );
  });
});
