import { Exam } from '../entity/Exam';

export interface ExamRepository {
  findByClassId(classId: string): Promise<Exam[]>;
  findById(id: string): Promise<Exam | undefined>;
  update(exam: Exam): Promise<Exam>;
  delete(exam: Exam): Promise<Exam>;
  create(exam: Exam): Promise<Exam>;
}
