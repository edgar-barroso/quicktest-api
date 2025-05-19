 // Adiciona as novas escolhasimport { Question, Choice } from '@/domain/entity/Question';
import { Choice, Question } from '@/domain/entity/Question';
import {
  Choice as ChoicePrisma,
  Question as QuestionPrisma,
} from '@prisma/client';

export class PrismaQuestionMapper {
  static toPrisma(question: Question): {
    question: Omit<QuestionPrisma, 'choices'>;
    choices: Omit<ChoicePrisma, 'question'>[];
  } {
    return {
      question: {
        id: question.getId(),
        description: question.getDescription(),
        createdAt: question.getCreatedAt(),
        authorId: question.getAuthorId(),
      },
      choices: question.getChoices().map((choice) => ({
        id: choice.getId(),
        text: choice.getText(),
        isCorrect: choice.getIsCorrect(),
        questionId: question.getId(),
      })),
    };
  }

  static toDomain({
    choices,
    question,
  }: {
    choices: ChoicePrisma[];
    question: QuestionPrisma;
  }): Question {
    return Question.create({
      id: question.id,
      description: question.description,
      authorId: question.authorId,
      createdAt: question.createdAt,
      choices: choices.map(
        (choice) => new Choice(choice.text, choice.isCorrect, choice.id),
      ),
    });
  }
}