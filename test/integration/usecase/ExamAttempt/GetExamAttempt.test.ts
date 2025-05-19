import { GetExamAttempt, GetExamAttemptInput } from "@/application/usecase/ExamAttempt/GetExamAttempt";
import { ExamAttemptRepository } from "@/domain/repository/ExamAttemptRepository";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { InMemoryExamAttemptRepository } from "@/infra/repository/InMemory/InMemoryExamAttemptRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { Exam } from "@/domain/entity/Exam";
import { ExamAttempt } from "@/domain/entity/ExamAttempt";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { ExamNotFoundError } from "@/application/error/ExamNotFoundError";
import { ExamAttemptNotFoundError } from "@/application/error/ExamAttemptNotFoundError";
import { dummyExamProps, dummyExamAttemptProps } from "../../../utils";

let sut: GetExamAttempt;
let examAttemptRepository: ExamAttemptRepository;
let examRepository: ExamRepository;
let exam: Exam;
let examAttempt: ExamAttempt;

beforeEach(async () => {
  examAttemptRepository = new InMemoryExamAttemptRepository();
  examRepository = new InMemoryExamRepository();
  sut = new GetExamAttempt(examAttemptRepository, examRepository);

  exam = Exam.create(dummyExamProps());
  examAttempt = ExamAttempt.create(dummyExamAttemptProps({ examId: exam.getId() }));

  await examRepository.create(exam);
  await examAttemptRepository.create(examAttempt);
});

describe("GetExamAttempt", () => {
  test("Deve retornar uma tentativa de exame existente", async () => {
    const input: GetExamAttemptInput = {
      id: examAttempt.getId(),
      userId: examAttempt.getStudentId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: examAttempt.getId(),
      examId: exam.getId(),
      studentId: examAttempt.getStudentId(),
      startedAt: examAttempt.getStartedAt(),
      answers: examAttempt.getAnswers().map((answer) => ({
        id: answer.getId(),
        questionId: answer.getQuestionId(),
        choiceId: answer.getChoiceId(),
      })),
    });
  });

  test("Deve lançar erro ao tentar buscar uma tentativa inexistente", async () => {
    const input: GetExamAttemptInput = {
      id: "non-existent-attempt-id",
      userId: examAttempt.getStudentId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamAttemptNotFoundError);
  });

  test("Deve lançar erro ao tentar buscar uma tentativa de um exame inexistente", async () => {
    await examRepository.delete(exam);

    const input: GetExamAttemptInput = {
      id: examAttempt.getId(),
      userId: examAttempt.getStudentId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamNotFoundError);
  });

  test("Deve lançar erro ao tentar acessar uma tentativa sem autorização", async () => {
    const input: GetExamAttemptInput = {
      id: examAttempt.getId(),
      userId: "unauthorized-user-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test("Deve permitir que o autor do exame acesse a tentativa", async () => {
    const input: GetExamAttemptInput = {
      id: examAttempt.getId(),
      userId: exam.getAuthorId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: examAttempt.getId(),
      examId: exam.getId(),
      studentId: examAttempt.getStudentId(),
      startedAt: examAttempt.getStartedAt(),
      answers: examAttempt.getAnswers().map((answer) => ({
        id: answer.getId(),
        questionId: answer.getQuestionId(),
        choiceId: answer.getChoiceId(),
      })),
    });
  });
});