import { ExamAttemptNotFoundError } from "@/application/error/ExamAttemptNotFoundError";
import { ExamNotFoundError } from "@/application/error/ExamNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { ExamAttemptRepository } from "@/domain/repository/ExamAttemptRepository";
import { ExamRepository } from "@/domain/repository/ExamRepository";

export interface GetExamAttemptInput {
  id: string;
  userId:string;
}

export interface GetExamAttemptOutput {
  id: string;
  examId: string;
  studentId: string;
  startedAt: Date;
  answers: {
    id: string;
    questionId: string;
    choiceId: string;
  }[];
}

export class GetExamAttempt {
  constructor(private readonly examAttemptRepository: ExamAttemptRepository, private readonly examRepository: ExamRepository) {}

  async execute(input: GetExamAttemptInput): Promise<GetExamAttemptOutput> {
    const attempt = await this.examAttemptRepository.findById(input.id);
    if (!attempt) {
      throw new ExamAttemptNotFoundError();
    }

    const exam = await this.examRepository.findById(attempt.getExamId());
    if (!exam) {
      throw new ExamNotFoundError();
    }

    if (attempt.getStudentId() !== input.userId && exam.getAuthorId() !== input.userId) {
      throw new UnauthorizedError("You are not authorized to view this exam attempt.");
    }
    
    return {
      id: attempt.getId(),
      examId: attempt.getExamId(),
      studentId: attempt.getStudentId(),
      startedAt: attempt.getStartedAt(),
      answers: attempt.getAnswers().map((answer) => ({
        id: answer.getId(),
        questionId: answer.getQuestionId(),
        choiceId: answer.getChoiceId(),
      })),
    };
  }
}