import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamAttemptNotFoundError } from '@/application/error/ExamAttemptNotFoundError';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { WeightlessCorrectExamAttempt } from '@/domain/service/correctExamAttempt/WeightlessCorrectExamAttempt';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';

export interface GradeExamAttemptInput {
  id: string;
}

export interface GradeExamAttemptOutput {
  id: string;
  score: number;
}

export class GradeExamAttempt {
  constructor(
    private readonly examAttemptRepository: ExamAttemptRepository,
    private readonly examRepository: ExamRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(input: GradeExamAttemptInput): Promise<GradeExamAttemptOutput> {
    const attempt = await this.examAttemptRepository.findById(input.id);
    if (!attempt) {
      throw new ExamAttemptNotFoundError();
    }

    const exam = await this.examRepository.findById(attempt.getExamId());
    if (!exam) {
      throw new ExamNotFoundError();
    }
    
    const questions = await Promise.all(
      exam.getQuestionsIds().map(async (questionId) => {
        const question = await this.questionRepository.findById(questionId);
        if (!question) {
          throw new QuestionNotFoundError();
        }
        return question;
      }),
    );

    const correctExamAttempt = new WeightlessCorrectExamAttempt(
      attempt.getAnswers(),
      questions,
    );
    const score = correctExamAttempt.getScore();

    return {
      id: attempt.getId(),
      score,
    };
  }
}
