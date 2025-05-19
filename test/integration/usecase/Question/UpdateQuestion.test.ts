import { UpdateQuestion } from "@/application/usecase/Question/UpdateQuestion";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { Question, Choice } from "@/domain/entity/Question";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";

let sut: UpdateQuestion;
let questionRepository: QuestionRepository;
let question: Question;

beforeEach(() => {
  questionRepository = new InMemoryQuestionRepository();
  sut = new UpdateQuestion(questionRepository);

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

describe("UpdateQuestion", () => {
  test("Deve atualizar a descrição de uma questão existente", async () => {
    const input = {
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: "What is 3 + 3?",
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: "What is 3 + 3?",
      choices: [
        { id: expect.any(String), text: "4", isCorrect: true },
        { id: expect.any(String), text: "5", isCorrect: false },
      ],
    });

    const updatedQuestion = await questionRepository.findById(question.getId());
    expect(updatedQuestion?.getDescription()).toBe("What is 3 + 3?");
  });

  test("Deve atualizar as escolhas de uma questão existente", async () => {
    const input = {
      id: question.getId(),
      authorId: question.getAuthorId(),
      choices: [
        { text: "6", isCorrect: true },
        { text: "7", isCorrect: false },
      ],
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: "What is 2 + 2?",
      choices: [
        { id: expect.any(String), text: "6", isCorrect: true },
        { id: expect.any(String), text: "7", isCorrect: false },
      ],
    });

    const updatedQuestion = await questionRepository.findById(question.getId());
    expect(updatedQuestion?.getChoices()).toHaveLength(2);
    expect(updatedQuestion?.getChoices()[0].getText()).toBe("6");
    expect(updatedQuestion?.getChoices()[0].getIsCorrect()).toBe(true);
  });

  test("Deve lançar erro ao tentar atualizar uma questão inexistente", async () => {
    const input = {
      id: "non-existent-question-id",
      authorId: "author-1",
      description: "What is 3 + 3?",
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });

  test("Deve lançar erro ao tentar atualizar uma questão com um autor inválido", async () => {
    const input = {
      id: question.getId(),
      authorId: "invalid-author-id",
      description: "What is 3 + 3?",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test("Deve atualizar tanto a descrição quanto as escolhas de uma questão existente", async () => {
    const input = {
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: "What is 5 + 5?",
      choices: [
        { text: "10", isCorrect: true },
        { text: "11", isCorrect: false },
      ],
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
      authorId: question.getAuthorId(),
      description: "What is 5 + 5?",
      choices: [
        { id: expect.any(String), text: "10", isCorrect: true },
        { id: expect.any(String), text: "11", isCorrect: false },
      ],
    });

    const updatedQuestion = await questionRepository.findById(question.getId());
    expect(updatedQuestion?.getDescription()).toBe("What is 5 + 5?");
    expect(updatedQuestion?.getChoices()).toHaveLength(2);
    expect(updatedQuestion?.getChoices()[0].getText()).toBe("10");
    expect(updatedQuestion?.getChoices()[0].getIsCorrect()).toBe(true);
  });
});