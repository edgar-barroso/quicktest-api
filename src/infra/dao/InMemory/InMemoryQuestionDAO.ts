import { QuestionDAO } from '@/application/dao/QuestionDAO';
import { Question } from '@/domain/entity/Question';

export class InMemoryQuestionDAO implements QuestionDAO {
  private static instance: InMemoryQuestionDAO;
  items: Question[] = [];

  private constructor() {}

  static getInstance(): InMemoryQuestionDAO {
    if (!InMemoryQuestionDAO.instance) {
      InMemoryQuestionDAO.instance = new InMemoryQuestionDAO();
    }
    return InMemoryQuestionDAO.instance;
  }

  findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      authorId: string;
      description: string;
      choices: { id: string; text: string; isCorrect: boolean }[];
    }[]
  > {
    const start = (page - 1) * pageLength;
    const end = start + pageLength;
    const items = this.items.slice(start, end).map((item) => ({
      id: item.getId(),
      authorId: item.getAuthorId(),
      description: item.getDescription(),
      choices: item.getChoices().map((choice) => ({
        id: choice.getId(),
        text: choice.getText(),
        isCorrect: choice.getIsCorrect(),
      })),
    }));
    return Promise.resolve(items);
  }
}
