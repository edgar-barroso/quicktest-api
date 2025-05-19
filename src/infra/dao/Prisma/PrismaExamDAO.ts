import { ExamDAO } from '@/application/dao/ExamDAO';
import { PrismaClient, Prisma } from '@prisma/client';

export class PrismaExamDAO implements ExamDAO {
  private readonly exam: PrismaClient['exam'];

  constructor(private readonly prisma: PrismaClient) {
    this.exam = prisma.exam;
  }

  async findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      authorId: string;
      title: string;
      description: string;
      classId: string;
      openDate: Date;
      closeDate: Date;
      createdAt: Date;
      questionsIds: string[];
    }[]
  > {
    const take = Number(pageLength );
    const skip = (page - 1) * pageLength;

    const findManyArgs: any = {
      take,
      include: {
        questions: true,
      },
    };
    if (skip > 0) findManyArgs.skip = skip;

    const exams = await this.exam.findMany(findManyArgs) as Prisma.ExamGetPayload<{ include: { questions: true } }>[];

    return exams.map((exam) => ({
      id: exam.id,
      authorId: exam.authorId,
      title: exam.title,
      description: exam.description,
      classId: exam.classId,
      openDate: exam.openDate,
      closeDate: exam.closeDate,
      createdAt: exam.createdAt,
      questionsIds: exam.questions.map((question) => question.id), 
    }));
  }
}