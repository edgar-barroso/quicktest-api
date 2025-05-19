import { UpdateClass, UpdateClassInput } from "@/application/usecase/Class/UpdateClass";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { Class } from "@/domain/entity/Class";
import { User } from "@/domain/entity/User";
import { dummyUserProps } from "../../../utils";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

let sut: UpdateClass;
let classRepository: ClassRepository;
let teacher: User;
let classEntity: Class;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  sut = new UpdateClass(classRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  classEntity = Class.create({
    title: "Turma de Matemática",
    teacherId: teacher.getId(),
  });

  await classRepository.create(classEntity);
});

describe("UpdateClass", () => {
  test("Deve atualizar uma turma existente", async () => {
    const input: UpdateClassInput = {
      id: classEntity.getId(),
      teacherId: teacher.getId(),
      title: "Turma de Física",
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: classEntity.getId(),
      title: "Turma de Física",
      teacherId: teacher.getId(),
    });

    const updatedClass = await classRepository.findById(classEntity.getId());
    expect(updatedClass?.getTitle()).toBe("Turma de Física");
  });

  test("Deve lançar erro ao tentar atualizar uma turma inexistente", async () => {
    const input: UpdateClassInput = {
      id: "non-existent-class-id",
      teacherId: teacher.getId(),
      title: "Turma de Física",
    };

    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve lançar erro ao tentar atualizar uma turma com um professor inválido", async () => {
    const input: UpdateClassInput = {
      id: classEntity.getId(),
      teacherId: "invalid-teacher-id",
      title: "Turma de Física",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});