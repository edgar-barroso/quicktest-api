import { Question } from '../entity/Question';

export interface QuestionRepository {
  update(question: Question): Promise<Question>;
  save(question: Question): Promise<Question>;
  delete(question: Question): Promise<Question>;
  create(question: Question): Promise<Question>;
  findById(id: string): Promise<Question | undefined>;
}