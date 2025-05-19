import { Question } from '@/domain/entity/Question';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { PrismaClient } from '@prisma/client';
import { PrismaQuestionMapper } from './Mappers/PrismaQuestionMapper';

export class PrismaQuestionRepository implements QuestionRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(question: Question): Promise<Question> {
    const { question: questionPrisma, choices } =
      PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({
      data: {
        ...questionPrisma,
        choices: {
          create: choices.map((choice) => ({
            id: choice.id,
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
        },
      },
    });

    return question;
  }

  async findById(id: string): Promise<Question | undefined> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { choices: true },
    });

    if (!question) return undefined;

    return PrismaQuestionMapper.toDomain({
      question,
      choices: question.choices,
    });
  }

  async update(question: Question): Promise<Question> {
    const { question: questionPrisma, choices } =
      PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.update({
      where: { id: questionPrisma.id },
      data: {
        ...questionPrisma,
        choices: {
          deleteMany: {},
          create: choices.map((choice) => ({
            id: choice.id,
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
        },
      },
    });

    return question;
  }

  async delete(question: Question): Promise<Question> {
    await this.prisma.question.delete({
      where: { id: question.getId() },
    });

    return question;
  }

  async save(question: Question): Promise<Question> {
    const existingQuestion = await this.findById(question.getId());
    if (existingQuestion) {
      return this.update(question);
    }
    return this.create(question);
  }
}
