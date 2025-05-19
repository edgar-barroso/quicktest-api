import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamAttempt } from '@/domain/entity/ExamAttempt';
import { prisma } from '@/lib/prisma';
import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';

export interface CreateExamAttemptInput {
  examId: string;
  studentId: string;
}

export interface CreateExamAttemptOutput{
  id: string;
}


export class CreateExamAttempt {
  constructor(
    private readonly examAttemptRepository: ExamAttemptRepository,
    private readonly examRepository: ExamRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateExamAttemptInput): Promise<CreateExamAttemptOutput> {

    const exam = await this.examRepository.findById(input.examId);
    if (!exam) {
      throw new ExamNotFoundError()
    }

    const student = await this.userRepository.findById(input.studentId);
    if (!student) {
      throw new UserNotFoundError()
    }

    if(!exam.isAvailable()){
      throw new UnauthorizedError('Exam is not available')
    }
    
    const attempt = ExamAttempt.create({
      examId: exam.getId(),
      studentId: student.getId(),
      answers: [],
      startedAt: new Date(),
    });
    
    const examAttempt = await this.examAttemptRepository.create(attempt)
    return {id:examAttempt.getId()}
  }
}