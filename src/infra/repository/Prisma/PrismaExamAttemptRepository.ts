import { ExamAttempt } from '@/domain/entity/ExamAttempt';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { PrismaClient, ExamAttempt as ExamAttemptPrisma } from '@prisma/client';
import { PrismaExamAttemptMapper } from './Mappers/PrismExamAttemptMapper';

export class PrismaExamAttemptRepositoy implements ExamAttemptRepository {
  private readonly examAttempt: PrismaClient['examAttempt'];

  constructor(private readonly prisma: PrismaClient) {
    this.examAttempt = prisma.examAttempt;
  }

  async findById(id: string): Promise<ExamAttempt | undefined> {
    const examAttempt = await this.examAttempt.findUnique({
      where: {
        id,
      },
      include: {
        answers: true,
      },
    });
    if (!examAttempt) {
      return undefined;
    }
    return PrismaExamAttemptMapper.toDomain(examAttempt);
  }

  async update(examAttempt: ExamAttempt): Promise<ExamAttempt> {
    const examAttemptPrisma = PrismaExamAttemptMapper.toPrisma(examAttempt);
    const updatedExamAttempt = await this.prisma.examAttempt.update({
      where: { id: examAttemptPrisma.id },
      data: {
        startedAt: examAttemptPrisma.startedAt,
      },
    });
    await this.prisma.answer.deleteMany({
      where: { examAttemptId: examAttemptPrisma.id },
    });
    await this.prisma.answer.createMany({
      data: examAttemptPrisma.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        choiceId: answer.choiceId,
        examAttemptId: examAttemptPrisma.id,
      })),
    });
    const answers = await this.prisma.answer.findMany({
      where: { examAttemptId: examAttemptPrisma.id },
    });
    return PrismaExamAttemptMapper.toDomain({ ...updatedExamAttempt, answers });
  }

  async delete(examAttempt: ExamAttempt): Promise<ExamAttempt> {
    const examAttemptPrisma = PrismaExamAttemptMapper.toPrisma(examAttempt);
    await this.prisma.answer.deleteMany({
      where: { examAttemptId: examAttemptPrisma.id },
    });
    const deletedExamAttempt = await this.prisma.examAttempt.delete({
      where: { id: examAttemptPrisma.id },
      include: { answers: true },
    });
    return PrismaExamAttemptMapper.toDomain(deletedExamAttempt);
  }

  async create(examAttempt: ExamAttempt): Promise<ExamAttempt> {
    const examAttemptPrisma = PrismaExamAttemptMapper.toPrisma(examAttempt);

    const createdExamAttempt = await this.prisma.examAttempt.create({
      data: {
        id: examAttemptPrisma.id,
        examId: examAttemptPrisma.examId,
        studentId: examAttemptPrisma.studentId,
        startedAt: examAttemptPrisma.startedAt,
      },
    });


    await this.prisma.answer.createMany({
      data: examAttemptPrisma.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        choiceId: answer.choiceId,
        examAttemptId: createdExamAttempt.id,
      })),
    });
    const answers = await this.prisma.answer.findMany({
      where: { examAttemptId: createdExamAttempt.id },
    });
    return PrismaExamAttemptMapper.toDomain({ ...createdExamAttempt, answers });
  }
}
