import { ExamAttempt, Answer } from '@/domain/entity/ExamAttempt';
import { UniqueEntityId } from '@/domain/valueObject/UniqueEntityId';
import { dummyExamAttemptProps } from '../../utils';
import { Validator } from 'class-validator';
import { ValidationError } from '@/domain/error/ValidationError';

describe('ExamAttempt', () => {
  test('Deve criar uma tentativa de exame com propriedades válidas', () => {
    const examAttemptProps = dummyExamAttemptProps();
    const examAttempt = ExamAttempt.create(examAttemptProps);

    expect(examAttempt.getId()).toEqual(expect.any(String));
    expect(examAttempt.getExamId()).toBe(examAttemptProps.examId);
    expect(examAttempt.getStudentId()).toBe(examAttemptProps.studentId);
    expect(examAttempt.getAnswers()).toHaveLength(
      examAttemptProps.answers.length,
    );
    expect(examAttempt.getStartedAt()).toEqual(examAttemptProps.startedAt);
  });

  test('Deve criar uma tentativa de exame com respostas', () => {
    const answers = [
      new Answer('question-1', 'choice-1'),
      new Answer('question-2', 'choice-2'),
    ];
    const examAttemptProps = dummyExamAttemptProps({ answers });
    const examAttempt = ExamAttempt.create(examAttemptProps);

    expect(examAttempt.getAnswers()).toHaveLength(2);
    expect(examAttempt.getAnswers()[0].getQuestionId()).toBe('question-1');
    expect(examAttempt.getAnswers()[0].getChoiceId()).toBe('choice-1');
  });

  test('Deve criar uma tentativa de exame com data de finalização', () => {
    const finishedAt = new Date();
    const examAttemptProps = dummyExamAttemptProps({ finishedAt });
    const examAttempt = ExamAttempt.create(examAttemptProps);

  });
  
  test('Deve criar uma tentativa de exame com propriedades válidas', () => {
    const examAttemptProps = dummyExamAttemptProps();
    const examAttempt = ExamAttempt.create(examAttemptProps);

    expect(examAttempt.getId()).toEqual(expect.any(String));
    expect(examAttempt.getExamId()).toBe(examAttemptProps.examId);
    expect(examAttempt.getStudentId()).toBe(examAttemptProps.studentId);
    expect(examAttempt.getAnswers()).toHaveLength(
      examAttemptProps.answers.length,
    );
    expect(examAttempt.getStartedAt()).toEqual(examAttemptProps.startedAt);
  });
  
});
