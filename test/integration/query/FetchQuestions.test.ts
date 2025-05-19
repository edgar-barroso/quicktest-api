import { FetchQuestions, FetchQuestionsInput } from "@/application/query/FetchQuestions";
import { QuestionDAO } from "@/application/dao/QuestionDAO";
import { Choice, Question } from "@/domain/entity/Question";
import { User } from "@/domain/entity/User";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { env } from "@/env";
import { InMemoryFactory } from "@/infra/fatory/InMemory/InMemoryRepositoryFactory";

let sut: FetchQuestions;
let questionRepository: QuestionRepository;
let daoRepository: QuestionDAO;

interface ExpectedQuestionOutput {
  id: string;
  authorId: string;
  description: string;
  choices: {
    id: string;
    text: string;
    isCorrect?: boolean;
  }[];
}

let user = User.create({
  id: "author-1",
  name: `author`,
  email: `author1@gmail.com`,
  password: "123456",
  role: "TEACHER",
});

beforeEach(async () => {
  const factory = InMemoryFactory.getInstance();
  questionRepository = factory.createQuestionRepository();
  daoRepository = factory.createQuestionDAO();
  sut = new FetchQuestions(daoRepository);

  // Create 200 sample questions
  for (let i = 0; i < 200; i++) {
    const question = Question.create({
      authorId: user.getId(),
      description: `Question Description ${i + 1}`,
      choices: [
        new Choice( "Choice 1", true ),
        new Choice( "Choice 2", false ),
        new Choice( "Choice 3", false ),
        new Choice( "Choice 4", false ),
      ],
    });
    await questionRepository.create(question);
  }
});

describe("FetchQuestions", () => {
  test("Deve ser possível receber várias questões", async () => {
    const expectQuestions: ExpectedQuestionOutput[] = [];

    for (let i = 0; i < 20; i++) {
      expectQuestions.push({
        id: expect.any(String),
        authorId: `author-1`,
        description: `Question Description ${i + 1}`,
        choices: [
          { id: expect.any(String), text: "Choice 1", isCorrect: true },
          { id: expect.any(String), text: "Choice 2", isCorrect: false },
          { id: expect.any(String), text: "Choice 3", isCorrect: false },
          { id: expect.any(String), text: "Choice 4", isCorrect: false },
        ],
      });
    }

    const input: FetchQuestionsInput = { page: 1, pageLength: 20, role: "TEACHER" };
    const output = await sut.execute(input);

    expect(output.questions).toHaveLength(20);
    expect(output.questions).toEqual(expect.arrayContaining(expectQuestions));
  });

  test("Deve ser possível receber as questões da página 2", async () => {
    const expectQuestions: ExpectedQuestionOutput[] = [];

    for (let i = 20; i < 40; i++) {
      expectQuestions.push({
        id: expect.any(String),
        authorId: `author-1`,
        description: `Question Description ${i + 1}`,
        choices: [
          { id: expect.any(String), text: "Choice 1", isCorrect: true },
          { id: expect.any(String), text: "Choice 2", isCorrect: false },
          { id: expect.any(String), text: "Choice 3", isCorrect: false },
          { id: expect.any(String), text: "Choice 4", isCorrect: false },
        ],
      });
    }

    const input: FetchQuestionsInput = { page: 2, pageLength: 20, role: "TEACHER" };
    const output = await sut.execute(input);

    expect(output.questions).toHaveLength(20);
    expect(output.questions).toEqual(expect.arrayContaining(expectQuestions));
  });

  test(`Deve ser possível receber o máximo de paginação permitido (${env.MAX_PAGE_LENGTH})`, async () => {
    const expectQuestions: ExpectedQuestionOutput[] = [];

    for (let i = 0; i < env.MAX_PAGE_LENGTH; i++) {
      expectQuestions.push({
        id: expect.any(String),
        authorId: `author-1`,
        description: `Question Description ${i + 1}`,
        choices: [
          { id: expect.any(String), text: "Choice 1", isCorrect: true },
          { id: expect.any(String), text: "Choice 2", isCorrect: false },
          { id: expect.any(String), text: "Choice 3", isCorrect: false },
          { id: expect.any(String), text: "Choice 4", isCorrect: false },
        ],
      });
    }

    const input: FetchQuestionsInput = { page: 1, role: "TEACHER" };
    const output = await sut.execute(input);

    expect(output.questions).toHaveLength(env.MAX_PAGE_LENGTH);
    expect(output.questions).toEqual(expect.arrayContaining(expectQuestions));
  });
});