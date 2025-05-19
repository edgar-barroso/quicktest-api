import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { UserRepository } from '@/domain/repository/UserRepository';

export interface GetQuestionInput {
  id: string;
  userId:string;
}

export interface GetQuestionOutput {
  id: string;
  authorId: string;
  description: string;
  choices: {
    id:string;
    text: string;
    isCorrect?: boolean;
  }[];
}

export class GetQuestion {
  constructor(private readonly questionRepository: QuestionRepository,private readonly userRepository: UserRepository) {}

  async execute(input: GetQuestionInput): Promise<GetQuestionOutput> {
    const question = await this.questionRepository.findById(input.id);
    if (!question) {
      throw new QuestionNotFoundError();
    }
    const user = await this.userRepository.findById(input.userId)

    if(!user){
      throw new UserNotFoundError()
    }

    return {
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: question.getDescription(),
      choices: question.getChoices().map((choice) => ({
        id: choice.getId(),
        text: choice.getText(),
        isCorrect: user.isTeacher() ? choice.getIsCorrect() : undefined,
      })),
    };
  }
}
