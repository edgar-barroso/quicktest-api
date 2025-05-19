import { Answer, ExamAttempt } from '@/domain/entity/ExamAttempt';
import { ExamAttempt as ExamAttemptPrisma } from '@prisma/client';

export class PrismaExamAttemptMapper {
  static toPrisma(examattempt: ExamAttempt): ExamAttemptPrisma & {
    answers: {
      id: string;
      questionId: string;
      choiceId: string;
      examAttemptId: string;
    }[];
  } {
    return {
      id: examattempt.getId(),
      examId: examattempt.getExamId(),
      studentId: examattempt.getStudentId(),
      startedAt: examattempt.getStartedAt(),
      answers: examattempt.getAnswers().map((answer) => ({
        id: answer.getId(),
        questionId: answer.getQuestionId(),
        choiceId: answer.getChoiceId(),
        examAttemptId: examattempt.getExamId(),
      })),
    };
  }

  static toDomain(
    examattemptPrisma: ExamAttemptPrisma & {
      answers: {
        id: string;
        questionId: string;
        choiceId: string;
        examAttemptId: string;
      }[];
    },
  ): ExamAttempt {
    const examAttempt = ExamAttempt.create({
      id: examattemptPrisma.id,
      examId: examattemptPrisma.examId,
      studentId: examattemptPrisma.studentId,
      answers: examattemptPrisma.answers.map(
        (answer) => new Answer(answer.questionId, answer.choiceId, answer.id),
      ),
      startedAt: examattemptPrisma.startedAt,
    });
    return examAttempt;
  }
}
