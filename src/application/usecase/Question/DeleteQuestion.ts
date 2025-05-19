import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";

export interface DeleteQuestionInput {
  authorId:string;
  id: string;
}

export interface DeleteQuestionOutput {
  id: string;
}

export class DeleteQuestion {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(input: DeleteQuestionInput): Promise<DeleteQuestionOutput> {
    const question = await this.questionRepository.findById(input.id);
    
    if (!question) {
      throw new QuestionNotFoundError();
    }

    if(input.authorId !== question.getAuthorId()){
      throw new UnauthorizedError("authorId");
    }

    await this.questionRepository.delete(question);

    return {
      id: question.getId(),
    };
  }
}