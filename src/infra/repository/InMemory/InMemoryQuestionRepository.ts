import { Question } from '@/domain/entity/Question';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

export class InMemoryQuestionRepository implements QuestionRepository {
  private static instance: InMemoryQuestionRepository;
  items: Question[] = [];

  constructor() {}
  
  async update(question: Question): Promise<Question> {
    this.items = this.items.map((item) => {
      if (item.getId() === question.getId()) {
        return question;
      }
      return item;
    });
    return question;
  }

  static getInstance(): InMemoryQuestionRepository {
    if (!InMemoryQuestionRepository.instance) {
      InMemoryQuestionRepository.instance = new InMemoryQuestionRepository();
    }
    return InMemoryQuestionRepository.instance;
  }

  async save(question: Question): Promise<Question> {
    const index = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    );

    if (index !== -1) {
      this.items[index] = question;
    } else {
      this.items.push(question);
    }

    return question;
  }

  async delete(question: Question): Promise<Question> {
    const index = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return question;
  }

  async create(question: Question): Promise<Question> {
    this.items.push(question);
    return this.items[this.items.length - 1];
  }

  async findById(id: string): Promise<Question | undefined> {
    return this.items.find((item) => item.getId() === id);
  }

}
