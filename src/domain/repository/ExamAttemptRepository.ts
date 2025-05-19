import { ExamAttempt } from "../entity/ExamAttempt";

export interface ExamAttemptRepository {
  findById(id: string): Promise<ExamAttempt | undefined>;
  update(examAttempt: ExamAttempt): Promise<ExamAttempt>;
  delete(examAttempt: ExamAttempt): Promise<ExamAttempt>;
  create(examAttempt: ExamAttempt): Promise<ExamAttempt>;
}