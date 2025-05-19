import { Exam } from '@/domain/entity/Exam';
import { ValidationError } from '@/domain/error/ValidationError';
import { dummyExamProps } from '../../utils';

describe('Exam', () => {
  test('Deve criar um exame com propriedades válidas', () => {
    const examProps = dummyExamProps();
    const exam = Exam.create(examProps);

    expect(exam.getId()).toEqual(expect.any(String));
    expect(exam.getTitle()).toBe(examProps.title);
    expect(exam.getDescription()).toBe(examProps.description);
    expect(exam.getAuthorId()).toBe(examProps.authorId);
    expect(exam.getClassId()).toBe(examProps.classId);
    expect(exam.getQuestionsIds()).toEqual(examProps.questionsIds);
    expect(exam.getOpenDate()).toEqual(examProps.openDate);
    expect(exam.getCloseDate()).toEqual(examProps.closeDate);
    expect(exam.getCreatedAt()).toEqual(examProps.createdAt);
  });

  test('Deve lançar erro se a data de fechamento for antes da data de abertura', () => {
    const examProps = dummyExamProps({
      openDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      closeDate: new Date(),
    });

    expect(() => Exam.create(examProps)).toThrow(ValidationError);
    expect(() => Exam.create(examProps)).toThrow('Close date must be after open date.');
  });

  test('Deve verificar se o exame está disponível', () => {
    const now = new Date();
    const examProps = dummyExamProps({
      openDate: new Date(now.getTime() - 1000 * 60 * 60),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60),
    });

    const exam = Exam.create(examProps);

    expect(exam.isAvailable(now)).toBe(true);
  });

  test('Deve verificar se o exame não está disponível antes da data de abertura', () => {
    const now = new Date();
    const examProps = dummyExamProps({
      openDate: new Date(now.getTime() + 1000 * 60 * 60),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 2),
    });

    const exam = Exam.create(examProps);

    expect(exam.isAvailable(now)).toBe(false);
  });

  test('Deve verificar se o exame não está disponível após a data de fechamento', () => {
    const now = new Date();
    const examProps = dummyExamProps({
      openDate: new Date(now.getTime() - 1000 * 60 * 60 * 2), 
      closeDate: new Date(now.getTime() - 1000 * 60 * 60), 
    });

    const exam = Exam.create(examProps);

    expect(exam.isAvailable(now)).toBe(false);
  });
});