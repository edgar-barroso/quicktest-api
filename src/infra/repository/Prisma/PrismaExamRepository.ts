import { Exam } from '@/domain/entity/Exam';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { PrismaClient } from '@prisma/client';
import { PrismaExamMapper } from './Mappers/PrismaExamMapper';

export class PrismaExamRepository implements ExamRepository {
  private readonly exam: PrismaClient['exam'];

  constructor(private readonly prisma: PrismaClient) {
    this.exam = prisma.exam;
  }

  async findById(id: string): Promise<Exam | undefined> {
    const examPrisma = await this.exam.findUnique({
      where: { id },
      include: { questions: true }, 
    });

    if (!examPrisma) return undefined;

    return PrismaExamMapper.toDomain(examPrisma);
  }

  async findByClassId(classId: string): Promise<Exam[]> {
    const examsPrisma = await this.exam.findMany({
      where: { classId },
      include: { questions: true },
    });

    return examsPrisma.map((examPrisma) => PrismaExamMapper.toDomain(examPrisma));
  }

  async create(exam: Exam): Promise<Exam> {
    const { questionsIds, ...examPrisma } = PrismaExamMapper.toPrisma(exam);

    await this.exam.create({
      data: {
        ...examPrisma,
        questions: {
          connect: questionsIds.map((id) => ({ id })), 
        },
      },
    });

    return exam;
  }

  async update(exam: Exam): Promise<Exam> {
    const { questionsIds, ...examPrisma } = PrismaExamMapper.toPrisma(exam);

   
    const existingExam = await this.exam.findUnique({
      where: { id: examPrisma.id },
      include: { questions: true },
    });

    if (!existingExam) {
      throw new Error(`Exam with ID ${examPrisma.id} not found`);
    }

    const existingQuestionIds = existingExam.questions.map((question) => question.id);

    const questionsToConnect = questionsIds.filter((id) => !existingQuestionIds.includes(id));
    const questionsToDisconnect = existingQuestionIds.filter((id) => !questionsIds.includes(id));

    await this.exam.update({
      where: { id: examPrisma.id },
      data: {
        ...examPrisma,
        questions: {
          connect: questionsToConnect.map((id) => ({ id })),
          disconnect: questionsToDisconnect.map((id) => ({ id })), 
        },
      },
    });

    return exam;
  }

  async delete(exam: Exam): Promise<Exam> {
    await this.exam.delete({
      where: { id: exam.getId() },
    });

    return exam;
  }
}