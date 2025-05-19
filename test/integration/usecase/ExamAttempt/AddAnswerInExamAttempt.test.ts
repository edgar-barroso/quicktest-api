import {
  AddAnswerInExamAttempt,
  AddAnswerInExamAttemptInput,
} from '@/application/usecase/ExamAttempt/AddAnswerInExamAttempt';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { InMemoryExamAttemptRepository } from '@/infra/repository/InMemory/InMemoryExamAttemptRepository';
import { InMemoryUserRepository } from '@/infra/repository/InMemory/InMemoryUserRepository';
import { InMemoryQuestionRepository } from '@/infra/repository/InMemory/InMemoryQuestionRepository';
import { ExamAttempt } from '@/domain/entity/ExamAttempt';
import { Question, Choice } from '@/domain/entity/Question';
import { User } from '@/domain/entity/User';
import { ExamAttemptNotFoundError } from '@/application/error/ExamAttemptNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import {
  dummyUserProps,
  dummyQuestionProps,
  dummyExamAttemptProps,
  dummyExamProps,
} from '../../../utils';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { InMemoryExamRepository } from '@/infra/repository/InMemory/InMemoryExamRepository';
import { Exam } from '@/domain/entity/Exam';

let sut: AddAnswerInExamAttempt;
let examAttemptRepository: ExamAttemptRepository;
let userRepository: UserRepository;
let questionRepository: QuestionRepository;
let student: User;
let question: Question;
let examAttempt: ExamAttempt;
let studentUnauthorized: User;
let examRepository: ExamRepository;
let exam: Exam;
let teacher: User;

beforeEach(async () => {
  examAttemptRepository = new InMemoryExamAttemptRepository();
  userRepository = new InMemoryUserRepository();
  questionRepository = new InMemoryQuestionRepository();
  examRepository = new InMemoryExamRepository();
  sut = new AddAnswerInExamAttempt(
    examAttemptRepository,
    userRepository,
    questionRepository,
    examRepository,
  );

  teacher = User.create(dummyUserProps({ role: 'TEACHER' }));
  student = User.create(dummyUserProps({ role: 'STUDENT' }));
  question = Question.create(
    dummyQuestionProps({
      choices: [
        new Choice('text-1', false, 'choice-1'),
        new Choice('text-1', true, 'choice-2'),
        new Choice('text-1', false, 'choice-3'),
        new Choice('text-1', false, 'choice-4'),
      ],
    }),
  );
  exam = Exam.create(dummyExamProps({
    authorId: teacher.getId(),
    questionsIds: [question.getId()],
    openDate: new Date(),
    closeDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }));

  examAttempt = ExamAttempt.create(
    dummyExamAttemptProps({ studentId: student.getId() ,answers:[],examId: exam.getId() }),
  );

  studentUnauthorized = User.create(
    dummyUserProps({ role: 'STUDENT' }),
  );
  await userRepository.create(teacher);
  await examRepository.create(exam);
  await userRepository.create(student);
  await userRepository.create(studentUnauthorized);
  await questionRepository.create(question);
  await examAttemptRepository.create(examAttempt);
});

describe('AddAnswerInExamAttempt', () => {
  test('Deve adicionar uma resposta válida a uma tentativa de exame', async () => {
    const input: AddAnswerInExamAttemptInput = {
      id: examAttempt.getId(),
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
      userId: student.getId(),
    };
    const output = await sut.execute(input);

    expect(output).toEqual({
      id: examAttempt.getId(),
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
    });

    const updatedAttempt = await examAttemptRepository.findById(
      examAttempt.getId(),
    );
    expect(updatedAttempt?.getAnswers()).toHaveLength(1);
    expect(updatedAttempt?.getAnswers()[0].getQuestionId()).toBe(
      question.getId(),
    );
    expect(updatedAttempt?.getAnswers()[0].getChoiceId()).toBe(
      question.getChoices()[0].getId(),
    );
  });

  test('Deve lançar erro ao tentar adicionar uma resposta a uma tentativa inexistente', async () => {
    const input: AddAnswerInExamAttemptInput = {
      id: 'non-existent-attempt-id',
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
      userId: student.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamAttemptNotFoundError);
  });

  test('Deve lançar erro ao tentar adicionar uma resposta com um usuário inexistente', async () => {
    const input: AddAnswerInExamAttemptInput = {
      id: examAttempt.getId(),
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
      userId: 'non-existent-user-id',
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test('Deve lançar erro ao tentar adicionar uma resposta sem autorização', async () => {
    const input: AddAnswerInExamAttemptInput = {
      id: examAttempt.getId(),
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
      userId: studentUnauthorized.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test('Deve lançar erro ao tentar adicionar uma resposta a uma questão inexistente', async () => {
    const input: AddAnswerInExamAttemptInput = {
      id: examAttempt.getId(),
      questionId: 'non-existent-question-id',
      choiceId: 'non-existent-choice-id',
      userId: student.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });

  test('Deve lançar erro ao tentar adicionar uma resposta fora do período permitido', async () => {

    const input: AddAnswerInExamAttemptInput = {
      id: examAttempt.getId(),
      questionId: question.getId(),
      choiceId: question.getChoices()[0].getId(),
      userId: student.getId(),
      now: new Date(Date.now() - 48 * 60 * 60 * 1000), 
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});
