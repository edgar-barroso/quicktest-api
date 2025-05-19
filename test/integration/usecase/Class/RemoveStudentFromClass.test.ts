import { RemoveStudentFromClass, RemoveStudentFromClassInput } from "@/application/usecase/Class/RemoveStudentFromClass";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryClassRepository } from "@/infra/repository/InMemory/InMemoryClassRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { User } from "@/domain/entity/User";
import { Class } from "@/domain/entity/Class";
import { dummyUserProps } from "../../../utils";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";

let sut: RemoveStudentFromClass;
let classRepository: ClassRepository;
let userRepository: UserRepository;
let teacher: User;
let student: User;
let classEntity: Class;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  userRepository = new InMemoryUserRepository();
  sut = new RemoveStudentFromClass(classRepository, userRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));

  await userRepository.create(teacher);
  await userRepository.create(student);

  classEntity = Class.create({
    title: "Turma de Matemática",
    teacherId: teacher.getId(),
  });

  classEntity.addStudentId(student.getId());
  await classRepository.create(classEntity);
});

describe("RemoveStudentFromClass", () => {
  test("Deve remover um estudante de uma turma existente", async () => {
    const input: RemoveStudentFromClassInput = {
      id: classEntity.getId(),
      studentId: student.getId(),
      teacherId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      classId: classEntity.getId(),
    });

    const updatedClass = await classRepository.findById(classEntity.getId());
    expect(updatedClass?.getStudentsIds()).toHaveLength(0);
  });

  test("Deve lançar erro ao tentar remover um estudante de uma turma inexistente", async () => {
    const input: RemoveStudentFromClassInput = {
      id: "non-existent-class-id",
      studentId: student.getId(),
      teacherId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve lançar erro ao tentar remover um usuário inexistente como estudante", async () => {
    const input: RemoveStudentFromClassInput = {
      id: classEntity.getId(),
      studentId: "non-existent-student-id",
      teacherId: teacher.getId(),

    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  
});