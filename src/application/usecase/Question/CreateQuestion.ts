import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { Choice, Question } from "@/domain/entity/Question";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { UserRepository } from "@/domain/repository/UserRepository";

export interface CreateQuestionInput {
  authorId: string;
  description: string;
  choices: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface CreateQuestionOutput {
  id: string;
  authorId: string;
  description: string;
  choices: {
    id:string;
    text: string;
    isCorrect: boolean;
  }[];
}

export class CreateQuestion {
  constructor(private readonly questionRepository: QuestionRepository,private readonly userRepository: UserRepository) {}

  async execute(input: CreateQuestionInput): Promise<CreateQuestionOutput> {
    const teacher = await this.userRepository.findById(input.authorId);
    if (!teacher) {
      throw new UserNotFoundError();
    }

    const question = Question.create({
      authorId: teacher.getId(),
      description: input.description,
      choices: input.choices.map((choice) => (new Choice(choice.text, choice.isCorrect)))
    });
    await this.questionRepository.create(question);

    return {
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: question.getDescription(),
      choices: question.getChoices().map((choice) => ({
        id: choice.getId(),
        text: choice.getText(),
        isCorrect: choice.getIsCorrect(),
      })),
    };
  }
}