import { ExamAttempt } from '@/domain/entity/ExamAttempt';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';

export class InMemoryExamAttemptRepository implements ExamAttemptRepository {
  private static instance: InMemoryExamAttemptRepository;
  items: ExamAttempt[] = [];

  constructor() {}

  async update(examattempt: ExamAttempt): Promise<ExamAttempt> {
    this.items = this.items.map((item) => {
      if (item.getId() === examattempt.getId()) {
        return examattempt;
      }
      return item;
    });
    return examattempt;
  }

  static getInstance(): InMemoryExamAttemptRepository {
    if (!InMemoryExamAttemptRepository.instance) {
      InMemoryExamAttemptRepository.instance =
        new InMemoryExamAttemptRepository();
    }
    return InMemoryExamAttemptRepository.instance;
  }

  async delete(examattempt: ExamAttempt): Promise<ExamAttempt> {
    const index = this.items.findIndex(
      (item) => item.getId() === examattempt.getId(),
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return examattempt;
  }

  async create(examattempt: ExamAttempt): Promise<ExamAttempt> {
    this.items.push(examattempt);
    return this.items[this.items.length - 1];
  }

  async findById(id: string): Promise<ExamAttempt | undefined> {
    return this.items.find((item) => item.getId() === id);
  }
}
