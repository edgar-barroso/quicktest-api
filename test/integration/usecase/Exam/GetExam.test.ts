import { GetExam, GetExamInput } from "@/application/usecase/Exam/GetExam";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { Exam } from "@/domain/entity/Exam";
import { User } from "@/domain/entity/User";
import { Question, Choice } from "@/domain/entity/Question";
import { ExamNotFoundError } from "@/application/error/ExamNotFoundError";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";
import { dummyUserProps, dummyQuestionProps, dummyExamProps } from "../../../utils";

let sut: GetExam;
let examRepository: ExamRepository;
let userRepository: UserRepository;
let questionRepository: QuestionRepository;
let teacher: User;
let student: User;
let exam: Exam;
let questions: Question[];

beforeEach(async () => {
  examRepository = new InMemoryExamRepository();
  userRepository = new InMemoryUserRepository();
  questionRepository = new InMemoryQuestionRepository();
  sut = new GetExam(examRepository, userRepository, questionRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));

  questions = Array.from({ length: 2 }).map(() =>
    Question.create(dummyQuestionProps({ authorId: teacher.getId() }))
  );

  exam = Exam.create(
    dummyExamProps({
      authorId: teacher.getId(),
      questionsIds: questions.map((q) => q.getId()),
    })
  );

  await userRepository.create(teacher);
  await userRepository.create(student);
  await examRepository.create(exam);
  await Promise.all(questions.map((q) => questionRepository.create(q)));
});

describe("GetExam", () => {
  test("Deve retornar um exame existente para um professor", async () => {
    const input: GetExamInput = {
      id: exam.getId(),
      userId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: exam.getId(),
      classId: exam.getClassId(),
      title: exam.getTitle(),
      description: exam.getDescription(),
      authorId: teacher.getId(),
      closeDate: exam.getCloseDate(),
      openDate: exam.getOpenDate(),
      questions: questions.map((question) => ({
        id: question.getId(),
        description: question.getDescription(),
        choices: question.getChoices().map((choice) => ({
          id: choice.getId(),
          text: choice.getText(),
          isCorrect: choice.getIsCorrect(),
        })),
      })),
    });
  });

  test("Deve retornar um exame existente para um estudante (sem mostrar respostas corretas)", async () => {
    const input: GetExamInput = {
      id: exam.getId(),
      userId: student.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: exam.getId(),
      classId: exam.getClassId(),
      title: exam.getTitle(),
      description: exam.getDescription(),
      authorId: teacher.getId(),
      closeDate: exam.getCloseDate(),
      openDate: exam.getOpenDate(),
      questions: questions.map((question) => ({
        id: question.getId(),
        description: question.getDescription(),
        choices: question.getChoices().map((choice) => ({
          id: choice.getId(),
          text: choice.getText(),
          isCorrect: undefined, // Respostas corretas não são exibidas para estudantes
        })),
      })),
    });
  });

  test("Deve lançar erro ao tentar buscar um exame inexistente", async () => {
    const input: GetExamInput = {
      id: "non-existent-exam-id",
      userId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ExamNotFoundError);
  });

  test("Deve lançar erro ao tentar buscar um exame com um usuário inexistente", async () => {
    const input: GetExamInput = {
      id: exam.getId(),
      userId: "non-existent-user-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test("Deve lançar erro ao tentar buscar um exame com uma questão inexistente", async () => {
    const invalidExam = Exam.create(
      dummyExamProps({
        authorId: teacher.getId(),
        questionsIds: [...questions.map((q) => q.getId()), "non-existent-question-id"],
      })
    );

    await examRepository.create(invalidExam);

    const input: GetExamInput = {
      id: invalidExam.getId(),
      userId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });
});