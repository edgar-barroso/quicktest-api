import { GradeExamAttempt, GradeExamAttemptInput } from "@/application/usecase/ExamAttempt/GradeExamAttempt";
import { ExamAttemptRepository } from "@/domain/repository/ExamAttemptRepository";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { InMemoryExamAttemptRepository } from "@/infra/repository/InMemory/InMemoryExamAttemptRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { Exam } from "@/domain/entity/Exam";
import { Answer, ExamAttempt } from "@/domain/entity/ExamAttempt";
import { Question, Choice } from "@/domain/entity/Question";
import { ExamAttemptNotFoundError } from "@/application/error/ExamAttemptNotFoundError";
import { ExamNotFoundError } from "@/application/error/ExamNotFoundError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";
import { dummyExamProps, dummyExamAttemptProps, dummyQuestionProps } from "../../../utils";

let sut: GradeExamAttempt;
let examAttemptRepository: ExamAttemptRepository;
let examRepository: ExamRepository;
let questionRepository: QuestionRepository;
let exam: Exam;
let examAttempt: ExamAttempt;
let questions: Question[];

beforeEach(async () => {
  examAttemptRepository = new InMemoryExamAttemptRepository();
  examRepository = new InMemoryExamRepository();
  questionRepository = new InMemoryQuestionRepository();
  sut = new GradeExamAttempt(examAttemptRepository, examRepository, questionRepository);

  questions = Array.from({ length: 3 }).map((_, index) =>
    Question.create(
      dummyQuestionProps({
        choices: [
          new Choice("Choice 1", index === 0, `choice-${index}-1`),
          new Choice("Choice 2", index !== 0, `choice-${index}-2`),
        ],
      })
    )
  );

  exam = Exam.create(
    dummyExamProps({
      questionsIds: questions.map((q) => q.getId()),
    })
  );

  examAttempt = ExamAttempt.create(
    dummyExamAttemptProps({
      examId: exam.getId(),
      answers: [
        new Answer(questions[0].getId(), questions[0].getChoices()[0].getId()),
        new Answer(questions[1].getId(), questions[1].getChoices()[1].getId()), 
        new Answer(questions[2].getId(), questions[2].getChoices()[0].getId()), 
      ],
    })
  );

  await Promise.all(questions.map((q) => questionRepository.create(q)));
  await examRepository.create(exam);
  await examAttemptRepository.create(examAttempt);
});

describe("GradeExamAttempt", () => {
  test("Deve calcular corretamente a nota de uma tentativa de exame", async () => {
    const input: GradeExamAttemptInput = {
      id: examAttempt.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: examAttempt.getId(),
      score: 2 / 3, // 2 respostas corretas de 3
    });
  });

  test("Deve lançar erro ao tentar calcular a nota de uma tentativa inexistente", async () => {
    const input: GradeExamAttemptInput = {
      id: "non-existent-attempt-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamAttemptNotFoundError);
  });

  test("Deve lançar erro ao tentar calcular a nota de um exame inexistente", async () => {
    await examRepository.delete(exam);

    const input: GradeExamAttemptInput = {
      id: examAttempt.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamNotFoundError);
  });

  test("Deve lançar erro ao tentar calcular a nota com uma questão inexistente", async () => {
    await questionRepository.delete(questions[0]);

    const input: GradeExamAttemptInput = {
      id: examAttempt.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });
});