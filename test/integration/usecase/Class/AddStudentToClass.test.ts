import { AddStudentToClass, AddStudentToClassInput } from "@/application/usecase/Class/AddStudentToClass";
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

let sut: AddStudentToClass;
let classRepository: ClassRepository;
let userRepository: UserRepository;
let teacher: User;
let student: User;
let classEntity: Class;

beforeEach(async () => {
  classRepository = new InMemoryClassRepository();
  userRepository = new InMemoryUserRepository();
  sut = new AddStudentToClass(classRepository, userRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));

  await userRepository.create(teacher);
  await userRepository.create(student);

  classEntity = Class.create({
    title: "Turma de Matemática",
    teacherId: teacher.getId(),
  });

  await classRepository.create(classEntity);
});

describe("AddStudentToClass", () => {
  test("Deve adicionar um estudante a uma turma existente", async () => {
    const input: AddStudentToClassInput = {
      id: classEntity.getId(),
      studentId: student.getId(),
      teacherId: teacher.getId(),
      
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      classId: classEntity.getId(),
    });

    const updatedClass = await classRepository.findById(classEntity.getId());
    expect(updatedClass?.getStudentsIds()).toHaveLength(1);
    expect(updatedClass?.getStudentsIds()[0]).toBe(student.getId());
  });

  test("Deve lançar erro ao tentar adicionar um estudante a uma turma inexistente", async () => {
    const input: AddStudentToClassInput = {
      id: "non-existent-class-id",
      studentId: student.getId(),
      teacherId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(ClassNotFoundError);
  });

  test("Deve lançar erro ao tentar adicionar um usuário inexistente como estudante", async () => {
    const input: AddStudentToClassInput = {
      id: classEntity.getId(),
      studentId: "non-existent-student-id",
      teacherId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });

  test("Deve lançar erro ao tentar adicionar um usuário que não é estudante", async () => {
    const nonStudent = User.create(dummyUserProps({ role: "TEACHER" }));
    await userRepository.create(nonStudent);

    const input: AddStudentToClassInput = {
      id: classEntity.getId(),
      studentId: nonStudent.getId(),
      teacherId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
  test("Deve lançar erro ao tentar adicionar um estudante a uma turma com um professor inválido", async () => {
    const input: AddStudentToClassInput = {
      id: classEntity.getId(),
      studentId: student.getId(),
      teacherId: student.getId(), 
    };
  
    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
  test("Deve lançar erro ao tentar adicionar um estudante a uma turma com um professor que não é o professor da turma", async () => {
    const anotherTeacher = User.create(dummyUserProps({ role: "TEACHER" }));
    await userRepository.create(anotherTeacher);

    const input: AddStudentToClassInput = {
      id: classEntity.getId(),
      studentId: student.getId(),
      teacherId: anotherTeacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });
});