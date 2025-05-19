import { GetClass, GetClassInput } from "@/application/usecase/Class/GetClass";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { Class } from "@/domain/entity/Class";
import { User } from "@/domain/entity/User";
import { Exam } from "@/domain/entity/Exam";
import { dummyUserProps, dummyExamProps } from "../../../utils";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { ExamRepository } from "@/domain/repository/ExamRepository";

let sut: GetClass;
let teacher: User;
let student: User;
let classEntity: Class;
let exam: Exam;
let classRepository: ClassRepository;
let userRepository: UserRepository;
let examRepository: ExamRepository;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  userRepository = new InMemoryUserRepository();
  examRepository = new InMemoryExamRepository();
  sut = new GetClass(classRepository, userRepository, examRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));
  classEntity = Class.create({
    title: "Turma de Matemática",
    teacherId: teacher.getId(),
  });

  exam = Exam.create(dummyExamProps({ classId: classEntity.getId() }));

  await userRepository.create(teacher);
  await userRepository.create(student);
  await classRepository.create(classEntity);
  await examRepository.create(exam);
});

describe("GetClass", () => {
  test("Deve retornar os detalhes de uma turma existente", async () => {
    const input: GetClassInput = { id: classEntity.getId() };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: classEntity.getId(),
      title: classEntity.getTitle(),
      teacherId: teacher.getId(),
      createdAt: classEntity.getCreatedAt(),
      students: [],
      exams: [
        {
          id: exam.getId(),
          title: exam.getTitle(),
          description: exam.getDescription(),
          createdAt: exam.getCreatedAt(),
          openDate: exam.getOpenDate(),
          closeDate: exam.getCloseDate(),
        },
      ],
    });
  });

  test("Deve incluir estudantes na turma", async () => {
    classEntity.addStudentId(student.getId());
    await classRepository.update(classEntity);
    const input: GetClassInput = { id: classEntity.getId() };
    const output = await sut.execute(input);
    expect(output.students).toEqual([
      {
        id: student.getId(),
        name: student.getName(),
        email: student.getEmail(),
      },
    ]);
  });

  test("Deve lançar erro ao tentar buscar uma turma inexistente", async () => {
    const input: GetClassInput = { id: "non-existent-class-id" };
    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve retornar uma turma sem exames associados", async () => {
    await examRepository.delete(exam);
    const input: GetClassInput = { id: classEntity.getId() };
    const output = await sut.execute(input);
    expect(output.exams).toEqual([]);
  });

  test("Deve retornar uma turma com o professor associado", async () => {
    const input: GetClassInput = { id: classEntity.getId() };
    const output = await sut.execute(input);
    expect(output.teacherId).toEqual(teacher.getId());
  });
});