import { CreateQuestion } from "@/application/usecase/Question/CreateQuestion";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { User } from "@/domain/entity/User";
import { dummyUserProps } from "../../../utils";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";

let sut: CreateQuestion;
let questionRepository: QuestionRepository;
let userRepository: UserRepository;
let teacher: User;

beforeEach(() => {
  questionRepository = new InMemoryQuestionRepository();
  userRepository = new InMemoryUserRepository();
  sut = new CreateQuestion(questionRepository, userRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  userRepository.create(teacher);
});

describe("CreateQuestion", () => {
  test("Deve criar uma questão com escolhas válidas", async () => {
    const input = {
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
      ],
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [
        { id: expect.any(String), text: "4", isCorrect: true },
        { id: expect.any(String), text: "5", isCorrect: false },
      ],
    });

    const createdQuestion = await questionRepository.findById(output.id);
    expect(createdQuestion).not.toBeNull();
    expect(createdQuestion?.getDescription()).toBe(input.description);
    expect(createdQuestion?.getChoices()).toHaveLength(2);
  });

  test("Deve lançar erro ao tentar criar uma questão com autor inexistente", async () => {
    const input = {
      authorId: "non-existent-author-id",
      description: "What is 2 + 2?",
      choices: [
        { text: "4", isCorrect: true },
        { text: "5", isCorrect: false },
      ],
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test("Deve lançar erro ao tentar criar uma questão sem escolhas", async () => {
    const input = {
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [],
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      "Question must have at least 2 choices"
    );
  });

  test("Deve lançar erro ao tentar criar uma questão com menos de 2 escolhas", async () => {
    const input = {
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [{ text: "4", isCorrect: true }],
    };

    await expect(sut.execute(input)).rejects.toThrowError(
      "Question must have at least 2 choices"
    );
  });
});