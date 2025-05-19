import { CreateClass, CreateClassInput } from "@/application/usecase/Class/CreateClass";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { User } from "@/domain/entity/User";
import { dummyUserProps } from "../../../utils";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

let sut: CreateClass;
let classRepository: ClassRepository;
let userRepository: UserRepository;
let teacher: User;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  userRepository = new InMemoryUserRepository();
  sut = new CreateClass(classRepository, userRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  await userRepository.create(teacher);
});

describe("CreateClass", () => {
  test("Deve criar uma turma com sucesso", async () => {
    const input: CreateClassInput = {
      title: "Turma de Matemática",
      teacherId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      title: input.title,
      teacherId: teacher.getId(),
      createdAt: expect.any(Date),
    });

    const createdClass = await classRepository.findById(output.id);
    expect(createdClass).toBeDefined();
    expect(createdClass?.getTitle()).toBe(input.title);
  });

  test("Deve lançar erro ao tentar criar uma turma com um professor inexistente", async () => {
    const input: CreateClassInput = {
      title: "Turma de Matemática",
      teacherId: "non-existent-teacher-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test("Deve lançar erro ao tentar criar uma turma com um usuário que não é professor", async () => {
    const student = User.create(dummyUserProps({ role: "STUDENT" }));
    await userRepository.create(student);

    const input: CreateClassInput = {
      title: "Turma de Matemática",
      teacherId: student.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});