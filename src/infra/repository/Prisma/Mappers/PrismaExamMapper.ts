import { Exam } from '@/domain/entity/Exam';
import { Exam as ExamPrisma, Question as QuestionPrisma } from '@prisma/client';

export class PrismaExamMapper {
  static toPrisma(exam: Exam): Omit<ExamPrisma, 'questions'> & { questionsIds: string[] } {
    return {
      id: exam.getId(),
      title: exam.getTitle(),
      description: exam.getDescription(),
      authorId: exam.getAuthorId(),
      classId: exam.getClassId(),
      createdAt: exam.getCreatedAt(),
      openDate: exam.getOpenDate(),
      closeDate: exam.getCloseDate(),
      questionsIds: exam.getQuestionsIds(), 
    };
  }

  static toDomain(
    examPrisma: ExamPrisma & { questions: QuestionPrisma[] }
  ): Exam {
    const questionsIds = examPrisma.questions.map((question) => question.id);
    return Exam.create({
      id: examPrisma.id,
      title: examPrisma.title,
      description: examPrisma.description,
      authorId: examPrisma.authorId,
      classId: examPrisma.classId,
      createdAt: examPrisma.createdAt,
      openDate: examPrisma.openDate,
      closeDate: examPrisma.closeDate,
      questionsIds,
    });
  }
}