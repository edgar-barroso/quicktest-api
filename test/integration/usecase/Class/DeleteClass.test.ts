import { DeleteClass, DeleteClassInput } from "@/application/usecase/Class/DeleteClass";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { Class } from "@/domain/entity/Class";
import { User } from "@/domain/entity/User";
import { dummyUserProps } from "../../../utils";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

let sut: DeleteClass;
let classRepository: ClassRepository;
let teacher: User;
let classEntity: Class;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  sut = new DeleteClass(classRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  classEntity = Class.create({
    title: "Turma de Matemática",
    teacherId: teacher.getId(),
  });

  await classRepository.create(classEntity);
});

describe("DeleteClass", () => {
  test("Deve deletar uma turma existente", async () => {
    const input: DeleteClassInput = {
      id: classEntity.getId(),
      teacherId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({ id: classEntity.getId() });

    const deletedClass = await classRepository.findById(classEntity.getId());
    expect(deletedClass).toBeUndefined();
  });

  test("Deve lançar erro ao tentar deletar uma turma inexistente", async () => {
    const input: DeleteClassInput = {
      id: "non-existent-class-id",
      teacherId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve lançar erro ao tentar deletar uma turma com um professor inválido", async () => {
    const input: DeleteClassInput = {
      id: classEntity.getId(),
      teacherId: "invalid-teacher-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});