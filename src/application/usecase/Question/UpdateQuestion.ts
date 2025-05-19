import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';
import { Choice, Question } from '@/domain/entity/Question';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

export interface UpdateQuestionInput {
  id: string;
  authorId: string;
  description?: string;
  choices?: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface UpdateQuestionOutput {
  id: string;
  authorId: string;
  description: string;
  choices: {
    id:string;
    text: string;
    isCorrect: boolean;
  }[];
}

export class UpdateQuestion {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(input: UpdateQuestionInput): Promise<UpdateQuestionOutput> {
    const existingQuestion = await this.questionRepository.findById(input.id);

    if (!existingQuestion) {
      throw new QuestionNotFoundError();
    }
    if (input.authorId !== existingQuestion.getAuthorId()) {
      throw new UnauthorizedError('authorId');
    }
    
    const updatedQuestion = Question.create({
      id: existingQuestion.getId(),
      authorId: existingQuestion.getAuthorId(),
      description: input.description || existingQuestion.getDescription(),
      choices: input.choices
        ? input.choices.map((choice) => (new Choice(choice.text, choice.isCorrect)))
        : existingQuestion.getChoices(),
      createdAt: existingQuestion.getCreatedAt(),
    }) 

     await this.questionRepository.update(updatedQuestion);

    return {
      id: updatedQuestion.getId(),
      authorId: updatedQuestion.getAuthorId(),
      description: updatedQuestion.getDescription(),
      choices: updatedQuestion.getChoices().map((choice) => ({
        id: choice.getId(),
        text: choice.getText(),
        isCorrect: choice.getIsCorrect()
      })),
    };
  }
}
