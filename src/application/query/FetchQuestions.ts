import { env } from '@/env';
import { QuestionDAO } from '../dao/QuestionDAO';

export interface FetchQuestionsInput {
  page: number;
  pageLength?: number;
  role: "TEACHER" | "STUDENT";
}

export interface FetchQuestionsOutput {
  questions: {
    id: string;
    authorId: string;
    description: string;
    choices: {
      id:string;
      text: string;
      isCorrect?: boolean;
    }[];
  }[];
}

export class FetchQuestions {
  constructor(private readonly questionDAO: QuestionDAO) {}

  async execute({
    page,
    pageLength,
    role
  }: FetchQuestionsInput): Promise<FetchQuestionsOutput> {

    const questions = await this.questionDAO.findAll(
      page,
      pageLength || env.MAX_PAGE_LENGTH,
    );
    return { questions: questions.map(question => ({
      id: question.id,
      authorId: question.authorId,
      description: question.description,
      choices: question.choices.map(choice => ({
        id: choice.id,
        text: choice.text,
        isCorrect:  role === "TEACHER" ? choice.isCorrect : undefined,
      })),
    })) };
  }
}
