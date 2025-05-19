import { Exam } from '@/domain/entity/Exam';
import { ExamRepository } from '@/domain/repository/ExamRepository';

export class InMemoryExamRepository implements ExamRepository {
  private static instance: InMemoryExamRepository;
  items: Exam[] = [];

  constructor() {}

  
  async update(exam: Exam): Promise<Exam> {
    this.items = this.items.map((item) => {
      if (item.getId() === exam.getId()) {
        return exam;
      }
      return item;
    });
    return exam;
  }

  static getInstance(): InMemoryExamRepository {
    if (!InMemoryExamRepository.instance) {
      InMemoryExamRepository.instance = new InMemoryExamRepository();
    }
    return InMemoryExamRepository.instance;
  }

  async delete(exam: Exam): Promise<Exam> {
    const index = this.items.findIndex(
      (item) => item.getId() === exam.getId(),
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return exam;
  }

  async create(exam: Exam): Promise<Exam> {
    this.items.push(exam);
    return this.items[this.items.length - 1];
  }

  async findById(id: string): Promise<Exam | undefined> {
    return this.items.find((item) => item.getId() === id);
  }

  async findByClassId(classId: string): Promise<Exam[]> {
    return this.items.filter((item) => item.getClassId() === classId);
  }


}
