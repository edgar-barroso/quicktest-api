import { FetchExams, FetchExamsInput } from "@/application/query/FetchExams";
import { ExamDAO } from "@/application/dao/ExamDAO";
import { Exam } from "@/domain/entity/Exam";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { InMemoryFactory } from "@/infra/fatory/InMemory/InMemoryRepositoryFactory";
import { env } from "@/env";

let sut: FetchExams;
let examRepository: ExamRepository;
let examDAO: ExamDAO;

interface ExpectedExamOutput {
  id: string;
  title: string;
  description: string;
  classId: string;
  authorId: string;
  closeDate: Date;
  openDate: Date;
  questionsIds: string[];
  createdAt: Date;
}

beforeEach(async () => {
  const factory = InMemoryFactory.getInstance();
  examRepository = factory.createExamRepository();
  examDAO = factory.createExamDAO();
  sut = new FetchExams(examDAO);

  // Create 200 sample exams
  for (let i = 0; i < 200; i++) {
    const exam = Exam.create({
      title: `Exam Title ${i + 1}`,
      description: `Exam Description ${i + 1}`,
      classId: `class-${i + 1}`,
      authorId: `author-${i + 1}`,
      closeDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day later
      openDate: new Date(Date.now()),
      questionsIds: [`question-${i + 1}`],
    });
    await examRepository.create(exam);
  }
});

describe("FetchExams", () => {
  test("Deve ser possível receber vários exames", async () => {
    const expectedExams: ExpectedExamOutput[] = [];

    for (let i = 0; i < 20; i++) {
      expectedExams.push({
        id: expect.any(String),
        title: `Exam Title ${i + 1}`,
        description: `Exam Description ${i + 1}`,
        classId: `class-${i + 1}`,
        authorId: `author-${i + 1}`,
        closeDate: expect.any(Date),
        openDate: expect.any(Date),
        createdAt: expect.any(Date),
        questionsIds: [`question-${i + 1}`],
      });
    }

    const input: FetchExamsInput = { page: 1, pageLength: 20 };
    const output = await sut.execute(input);

    expect(output.exams).toHaveLength(20);
    expect(output.exams).toEqual(expect.arrayContaining(expectedExams));
  });

  test("Deve ser possível receber os exames da página 2", async () => {
    const expectedExams: ExpectedExamOutput[] = [];

    for (let i = 20; i < 40; i++) {
      expectedExams.push({
        id: expect.any(String),
        title: `Exam Title ${i + 1}`,
        description: `Exam Description ${i + 1}`,
        classId: `class-${i + 1}`,
        authorId: `author-${i + 1}`,
        closeDate: expect.any(Date),
        openDate: expect.any(Date),
        createdAt: expect.any(Date),
        questionsIds: [`question-${i + 1}`],
      });
    }

    const input: FetchExamsInput = { page: 2, pageLength: 20 };
    const output = await sut.execute(input);

    expect(output.exams).toHaveLength(20);
    expect(output.exams).toEqual(expect.arrayContaining(expectedExams));
  });

  test(`Deve ser possível receber o máximo de paginação permitido (${env.MAX_PAGE_LENGTH})`, async () => {
    const expectedExams: ExpectedExamOutput[] = [];

    for (let i = 0; i < env.MAX_PAGE_LENGTH; i++) {
      expectedExams.push({
        id: expect.any(String),
        title: `Exam Title ${i + 1}`,
        description: `Exam Description ${i + 1}`,
        classId: `class-${i + 1}`,
        authorId: `author-${i + 1}`,
        closeDate: expect.any(Date),
        openDate: expect.any(Date),
        createdAt: expect.any(Date),
        questionsIds: [`question-${i + 1}`],
      });
    }

    const input: FetchExamsInput = { page: 1 };
    const output = await sut.execute(input);

    expect(output.exams).toHaveLength(env.MAX_PAGE_LENGTH);
    expect(output.exams).toEqual(expect.arrayContaining(expectedExams));
  });
});