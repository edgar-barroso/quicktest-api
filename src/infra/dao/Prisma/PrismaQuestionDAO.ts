import { QuestionDAO } from '@/application/dao/QuestionDAO';
import { PrismaClient } from '@prisma/client';

export class PrismaQuestionDAO implements QuestionDAO {
  private readonly question: PrismaClient['question'];

  constructor(prisma: PrismaClient) {
    this.question = prisma.question;
  }

  async findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      authorId: string;
      description: string;
      choices: { id: string; text: string; isCorrect?: boolean }[];
    }[]
  > {
    const take = Number(pageLength);
    const skip = (page - 1) * pageLength;

    const questions = await this.question.findMany({
      skip,
      take,
      include: {
        choices: true, 
      },
    });
    

    return questions.map((question) => ({
      id: question.id,
      authorId: question.authorId,
      description: question.description,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        text: choice.text,
        isCorrect: choice.isCorrect,
      })),
    }));
  }
}