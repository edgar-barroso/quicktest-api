import { ExamAttemptNotFoundError } from '@/application/error/ExamAttemptNotFoundError';
import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { UserRepository } from '@/domain/repository/UserRepository';

export interface AddAnswerToExamAttemptInput {
  id: string;
  questionId: string;
  choiceId: string;
  userId: string;
  now?: Date;
}

export interface AddAnswerToExamAttemptOutput {
  id: string;
  questionId: string;
  choiceId: string;
  message: string;
}

export class AddAnswerToExamAttempt {
  constructor(
    private readonly examAttemptRepository: ExamAttemptRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly examRepository: ExamRepository,
  ) {}

  async execute({
    id,
    questionId,
    choiceId,
    userId,
    now
  }: AddAnswerToExamAttemptInput): Promise<AddAnswerToExamAttemptOutput> {
    const examAttempt = await this.examAttemptRepository.findById(id);
    if (!examAttempt) {
      throw new ExamAttemptNotFoundError();
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (examAttempt.getStudentId() !== userId) {
      throw new UnauthorizedError(
        'You are not authorized to add an answer to this exam attempt.',
      );
    }
    const exam = await this.examRepository.findById(examAttempt.getExamId());
    if (!exam) {
      throw new ExamNotFoundError();
    }

    if (!exam.isAvailable(now)) {
      throw new UnauthorizedError(
        'You are not authorized to add an answer to this exam attempt.',
      );
    }

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new QuestionNotFoundError();
    }

    examAttempt.addAnswer(questionId, choiceId);

    await this.examAttemptRepository.update(examAttempt);

    return {
      id: examAttempt.getId(),
      questionId,
      choiceId,
      message: 'Resposta adicionada com sucesso'
    };
  }
}
