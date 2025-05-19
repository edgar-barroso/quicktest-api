import { GetQuestion } from "@/application/usecase/Question/GetQuestion";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { User } from "@/domain/entity/User";
import { Question, Choice } from "@/domain/entity/Question";
import { dummyUserProps } from "../../../utils";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";

let sut: GetQuestion;
let questionRepository: QuestionRepository;
let userRepository: UserRepository;
let teacher: User;
let student: User;
let question: Question;

beforeEach(() => {
  questionRepository = new InMemoryQuestionRepository();
  userRepository = new InMemoryUserRepository();
  sut = new GetQuestion(questionRepository, userRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));

  userRepository.create(teacher);
  userRepository.create(student);

  question = Question.create({
    authorId: teacher.getId(),
    description: "What is 2 + 2?",
    choices: [
      new Choice("4", true),
      new Choice("5", false),
    ],
  });

  questionRepository.create(question);
});

describe("GetQuestion", () => {
  test("Deve retornar uma questão existente para um professor", async () => {
    const input = {
      id: question.getId(),
      userId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [
        { id: expect.any(String), text: "4", isCorrect: true },
        { id: expect.any(String), text: "5", isCorrect: false },
      ],
    });
  });

  test("Deve retornar uma questão existente para um estudante (sem mostrar respostas corretas)", async () => {
    const input = {
      id: question.getId(),
      userId: student.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: question.getId(),
      authorId: teacher.getId(),
      description: "What is 2 + 2?",
      choices: [
        { id: expect.any(String), text: "4", isCorrect: undefined },
        { id: expect.any(String), text: "5", isCorrect: undefined },
      ],
    });
  });

  test("Deve lançar erro ao tentar buscar uma questão inexistente", async () => {
    const input = {
      id: "non-existent-question-id",
      userId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });

  test("Deve lançar erro ao tentar buscar uma questão com um usuário inexistente", async () => {
    const input = {
      id: question.getId(),
      userId: "non-existent-user-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });
});