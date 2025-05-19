import { UpdateExam, UpdateExamInput } from "@/application/usecase/Exam/UpdateExam";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { Exam } from "@/domain/entity/Exam";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { ExamNotFoundError } from "@/application/error/ExamNotFoundError";
import { dummyExamProps } from "../../../utils";

let sut: UpdateExam;
let examRepository: ExamRepository;
let exam: Exam;

beforeEach(async () => {
  examRepository = new InMemoryExamRepository();
  sut = new UpdateExam(examRepository);

  exam = Exam.create(dummyExamProps());
  await examRepository.create(exam);
});

describe("UpdateExam", () => {
  test("Deve atualizar um exame existente", async () => {
    const input: UpdateExamInput = {
      id: exam.getId(),
      userId: exam.getAuthorId(),
      title: "Exame Atualizado",
      description: "Descrição atualizada",
      closeDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 dias depois
      openDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 dia depois
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: exam.getId(),
      title: "Exame Atualizado",
      description: "Descrição atualizada",
      classId: exam.getClassId(),
      authorId: exam.getAuthorId(),
      closeDate: input.closeDate,
      openDate: input.openDate,
      questionsIds: exam.getQuestionsIds(),
    });

    const updatedExam = await examRepository.findById(exam.getId());
    expect(updatedExam?.getTitle()).toBe("Exame Atualizado");
    expect(updatedExam?.getDescription()).toBe("Descrição atualizada");
    expect(updatedExam?.getCloseDate()).toEqual(input.closeDate);
    expect(updatedExam?.getOpenDate()).toEqual(input.openDate);
  });

  test("Deve lançar erro ao tentar atualizar um exame inexistente", async () => {
    const input: UpdateExamInput = {
      id: "non-existent-exam-id",
      userId: exam.getAuthorId(),
      title: "Exame Atualizado",
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamNotFoundError);
  });

  test("Deve lançar erro ao tentar atualizar um exame com um autor inválido", async () => {
    const input: UpdateExamInput = {
      id: exam.getId(),
      userId: "invalid-author-id",
      title: "Exame Atualizado",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test("Deve atualizar apenas os campos fornecidos", async () => {
    const input: UpdateExamInput = {
      id: exam.getId(),
      userId: exam.getAuthorId(),
      title: "Título Atualizado",
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: exam.getId(),
      title: "Título Atualizado",
      description: exam.getDescription(),
      classId: exam.getClassId(),
      authorId: exam.getAuthorId(),
      closeDate: exam.getCloseDate(),
      openDate: exam.getOpenDate(),
      questionsIds: exam.getQuestionsIds(),
    });

    const updatedExam = await examRepository.findById(exam.getId());
    expect(updatedExam?.getTitle()).toBe("Título Atualizado");
    expect(updatedExam?.getDescription()).toBe(exam.getDescription());
  });
});