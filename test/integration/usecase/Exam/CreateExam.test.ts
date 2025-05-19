import { CreateExam, CreateExamInput } from "@/application/usecase/Exam/CreateExam";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { QuestionRepository } from "@/domain/repository/QuestionRepository";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { InMemoryQuestionRepository } from "@/infra/repository/InMemory/InMemoryQuestionRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { User } from "@/domain/entity/User";
import { Question } from "@/domain/entity/Question";
import { Class } from "@/domain/entity/Class";
import { dummyUserProps, dummyQuestionProps, dummyClassProps } from "../../../utils";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";

let sut: CreateExam;
let examRepository: ExamRepository;
let userRepository: UserRepository;
let questionRepository: QuestionRepository;
let classRepository: ClassRepository;
let teacher: User;
let student: User;
let questions: Question[];
let classEntity: Class;
let closeDate: Date;
let openDate: Date;

beforeEach(async () => {
  examRepository = new InMemoryExamRepository();
  userRepository = new InMemoryUserRepository();
  questionRepository = new InMemoryQuestionRepository();
  classRepository = new InMemoryClassRepository();
  sut = new CreateExam(classRepository, userRepository, examRepository, questionRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));
  questions = Array.from({ length: 3 }).map(() =>
    Question.create(dummyQuestionProps({ authorId: teacher.getId() }))
  );
  classEntity = Class.create(dummyClassProps({ teacherId: teacher.getId() }));
  closeDate = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  openDate = new Date(Date.now());

  await userRepository.create(teacher);
  await userRepository.create(student);
  await classRepository.create(classEntity);
  await Promise.all(questions.map((question) => questionRepository.create(question)));
});

describe("CreateExam", () => {
  test("Deve ser possível criar um exame", async () => {
    const input: CreateExamInput = {
      title: "Exame de Matemática",
      description: "Teste de conhecimentos básicos de matemática.",
      authorId: teacher.getId(),
      classId: classEntity.getId(),
      closeDate,
      openDate,
      questionsIds: questions.map((question) => question.getId()),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
    });

    const createdExam = await examRepository.findById(output.id);
    expect(createdExam).toBeDefined();
    expect(createdExam?.getTitle()).toBe(input.title);
    expect(createdExam?.getDescription()).toBe(input.description);
    expect(createdExam?.getClassId()).toBe(classEntity.getId());
    expect(createdExam?.getQuestionsIds()).toHaveLength(3);
  });

  test("Deve lançar erro se a turma não existir", async () => {
    const input: CreateExamInput = {
      title: "Exame de Matemática",
      description: "Teste de conhecimentos básicos de matemática.",
      authorId: teacher.getId(),
      classId: "non-existent-class-id",
      closeDate,
      openDate,
      questionsIds: questions.map((question) => question.getId()),
    };

    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve lançar erro se o autor não for o professor da turma", async () => {
    const input: CreateExamInput = {
      title: "Exame de Matemática",
      description: "Teste de conhecimentos básicos de matemática.",
      authorId: student.getId(), 
      classId: classEntity.getId(),
      closeDate,
      openDate,
      questionsIds: questions.map((question) => question.getId()),
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test("Deve lançar erro se uma questão não existir", async () => {
    const input: CreateExamInput = {
      title: "Exame de Matemática",
      description: "Teste de conhecimentos básicos de matemática.",
      authorId: teacher.getId(),
      classId: classEntity.getId(),
      closeDate,
      openDate,
      questionsIds: [...questions.map((question) => question.getId()), "non-existent-question-id"],
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });
});