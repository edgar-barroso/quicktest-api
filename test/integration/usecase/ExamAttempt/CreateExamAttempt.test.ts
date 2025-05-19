import {
  CreateExamAttempt,
  CreateExamAttemptInput,
} from '@/application/usecase/ExamAttempt/CreateExamAttempt';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { InMemoryExamRepository } from '@/infra/repository/InMemory/InMemoryExamRepository';
import { InMemoryUserRepository } from '@/infra/repository/InMemory/InMemoryUserRepository';
import { InMemoryExamAttemptRepository } from '@/infra/repository/InMemory/InMemoryExamAttemptRepository';
import { Exam } from '@/domain/entity/Exam';
import { User } from '@/domain/entity/User';
import { Question } from '@/domain/entity/Question';
import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import {
  dummyUserProps,
  dummyQuestionProps,
  dummyExamProps,
} from '../../../utils';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';

let sut: CreateExamAttempt;
let examAttemptRepository: ExamAttemptRepository;
let examRepository: ExamRepository;
let userRepository: UserRepository;
let teacher: User;
let student: User;
let exam: Exam;
let question: Question;

beforeEach(async () => {
  examAttemptRepository = new InMemoryExamAttemptRepository();
  examRepository = new InMemoryExamRepository();
  userRepository = new InMemoryUserRepository();
  sut = new CreateExamAttempt(
    examAttemptRepository,
    examRepository,
    userRepository,
  );

  teacher = User.create(dummyUserProps({ role: 'TEACHER' }));
  student = User.create(dummyUserProps({ role: 'STUDENT' }));
  question = Question.create(dummyQuestionProps({ authorId: teacher.getId() }));
  exam = Exam.create(
    dummyExamProps({
      authorId: teacher.getId(),
      questionsIds: [question.getId()],
      openDate: new Date(),
      closeDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }),
  );

  await userRepository.create(teacher);
  await userRepository.create(student);
  await examRepository.create(exam);
});

describe('CreateExamAttempt', () => {
  test('Deve ser possível criar uma tentativa de exame para um estudante', async () => {
    const input: CreateExamAttemptInput = {
      examId: exam.getId(),
      studentId: student.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
    });

    const attempt = await examAttemptRepository.findById(output.id);
    expect(attempt).toBeDefined();
    expect(attempt?.getExamId()).toBe(exam.getId());
    expect(attempt?.getStudentId()).toBe(student.getId());
  });

  test('Deve falhar ao criar uma tentativa para um exame inexistente', async () => {
    const input: CreateExamAttemptInput = {
      examId: 'non-existent-exam-id',
      studentId: student.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamNotFoundError);
  });

  test('Deve falhar ao criar uma tentativa para um estudante inexistente', async () => {
    const input: CreateExamAttemptInput = {
      examId: exam.getId(),
      studentId: 'non-existent-student-id',
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test('Deve falhar ao criar uma tentativa para um exame fora do período disponível', async () => {
    const examClosed = Exam.create(
      dummyExamProps({
        authorId: teacher.getId(),
        questionsIds: [question.getId()],
        openDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        closeDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }),
    );
    await examRepository.create(examClosed);
    const input: CreateExamAttemptInput = {
      examId: examClosed.getId(),
      studentId: student.getId(),
    };
    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test('Deve persistir a tentativa no repositório', async () => {
    const input: CreateExamAttemptInput = {
      examId: exam.getId(),
      studentId: student.getId(),
    };

    const output = await sut.execute(input);

    const attempt = await examAttemptRepository.findById(output.id);
    expect(attempt).toBeDefined();
    expect(attempt?.getExamId()).toBe(exam.getId());
    expect(attempt?.getStudentId()).toBe(student.getId());
  });
});
