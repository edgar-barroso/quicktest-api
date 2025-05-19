import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { UserRepository } from '@/domain/repository/UserRepository';

export interface GetExamInput {
  userId: string;
  id: string;
}

export interface GetExamOutput {
  id: string;
  title: string;
  description: string;
  classId: string;
  authorId: string;
  closeDate: Date;
  openDate: Date;
  questions: {
    id: string;
    description: string;
    choices: {
      id: string;
      text: string;
      isCorrect?: boolean;
    }[];
  }[];
}

export class GetExam {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(input: GetExamInput): Promise<GetExamOutput> {
    const exam = await this.examRepository.findById(input.id);

    if (!exam) {
      throw new ExamNotFoundError();
    }

    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError();
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

    return {
      id: exam.getId(),
      classId: exam.getClassId(),
      title: exam.getTitle(),
      description: exam.getDescription(),
      authorId: exam.getAuthorId(),
      closeDate: exam.getCloseDate(),
      openDate: exam.getOpenDate(),
      questions: questions.map((question) => ({
        id: question.getId(),
        description: question.getDescription(),
        choices: question.getChoices().map((choice) => ({
          id: choice.getId(),
          text: choice.getText(),
          isCorrect: user.isTeacher() ? choice.getIsCorrect() : undefined,
        })),
      })),
    };
  }
}
