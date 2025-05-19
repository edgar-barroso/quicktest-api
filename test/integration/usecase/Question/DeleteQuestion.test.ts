import { DeleteQuestion } from "@/application/usecase/Question/DeleteQuestion";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { Question, Choice } from "@/domain/entity/Question";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";

let sut: DeleteQuestion;
let questionRepository: QuestionRepository;
let question: Question;

beforeEach(() => {
  questionRepository = new InMemoryQuestionRepository();
  sut = new DeleteQuestion(questionRepository);

  question = Question.create({
    authorId: "author-1",
    description: "What is 2 + 2?",
    choices: [
      new Choice("4", true),
      new Choice("5", false),
    ],
  });

  questionRepository.create(question);
});

describe("DeleteQuestion", () => {
  test("Deve excluir uma questão existente", async () => {
    const input = {
      id: question.getId(),
      authorId: question.getAuthorId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
    });

    const deletedQuestion = await questionRepository.findById(question.getId());
    expect(deletedQuestion).toBeUndefined();
  });

  test("Deve lançar erro ao tentar excluir uma questão inexistente", async () => {
    const input = {
      id: "non-existent-question-id",
      authorId: "author-1",
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });

  test("Deve lançar erro ao tentar excluir uma questão com um autor inválido", async () => {
    const input = {
      id: question.getId(),
      authorId: "invalid-author-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});