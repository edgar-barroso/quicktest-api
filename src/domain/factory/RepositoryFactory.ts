import { ClassRepository } from '../repository/ClassRepository';
import { ExamAttemptRepository } from '../repository/ExamAttemptRepository';
import { ExamRepository } from '../repository/ExamRepository';
import { QuestionRepository } from '../repository/QuestionRepository';
import { UserRepository } from '../repository/UserRepository';

export interface RepositoryFactory {
  createUserRepository(): UserRepository;
  createExamRepository(): ExamRepository;
  createQuestionRepository(): QuestionRepository;
  createExamAttemptRepository(): ExamAttemptRepository;
  createClassRepository(): ClassRepository;
}
