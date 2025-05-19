import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';

export interface DeleteExamInput {
  id: string;
  userId: string;
}

export interface DeleteExamOutput {
  id: string;
}

export class DeleteExam {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly examRepository: ExamRepository,
  ) {}

  async execute(input: DeleteExamInput): Promise<DeleteExamOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const exam = await this.examRepository.findById(input.id);

    if (!exam) {
      throw new QuestionNotFoundError();
    }

    if (exam.getAuthorId() !== user.getId()) {
      throw new UnauthorizedError("You are not authorized to delete this exam.");
    }
    const deletedExam = await this.examRepository.delete(exam);
    return {
      id: deletedExam.getId(),
    };
  }
}
