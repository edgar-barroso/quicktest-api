import { Class } from "@/domain/entity/Class";
import { User } from "@/domain/entity/User";
import { dummyClassProps, dummyUserProps } from "./../../utils";
import { ValidationError } from "@/domain/error/ValidationError";

describe("Class", () => {
  let teacher: User;
  let student1: User;
  let student2: User;

  beforeEach(() => {
    teacher = User.create(dummyUserProps({ role: "TEACHER" }));
    student1 = User.create(dummyUserProps({ role: "STUDENT" }));
    student2 = User.create(dummyUserProps({ role: "STUDENT" }));
  });

  test("Deve criar uma classe com um professor", () => {
    const createClassProps = dummyClassProps({
      teacherId:teacher.getId(),
      title:"Class-1",
    })
    const classEntity = Class.create(createClassProps);
    expect(classEntity.getId()).toEqual(expect.any(String))
    expect(classEntity.getTeacherId()).toEqual(createClassProps.teacherId)
    expect(classEntity.getTitle()).toEqual(createClassProps.title)

    
  });

  test("Deve adicionar um estudante à classe", () => {
    const createClassProps = dummyClassProps()
    const classEntity = Class.create(createClassProps);
    expect(classEntity.getStudentsIds()).toHaveLength(0);
    classEntity.addStudentId(student1.getId());
    expect(classEntity.getStudentsIds()[0]).toEqual(student1.getId())
    expect(classEntity.getStudentsIds()).toHaveLength(1);

   
  });

  test("Deve lançar erro ao adicionar o mesmo estudante duas vezes", () => {
    const createClassProps = dummyClassProps()
    const classEntity = Class.create(createClassProps);
    classEntity.addStudentId(student1.getId());
    expect(()=>classEntity.addStudentId(student1.getId())).toThrow(ValidationError)
    
  });

  test("Deve remover um estudante da classe", () => {
    const createClassProps = dummyClassProps()
    const classEntity = Class.create(createClassProps);
    expect(classEntity.getStudentsIds()).toHaveLength(0);
    classEntity.addStudentId(student1.getId());
    expect(classEntity.getStudentsIds()).toHaveLength(1);
    classEntity.removeStudentId(student1.getId());
    expect(classEntity.getStudentsIds()).toHaveLength(0);
  });

  test("Deve lançar erro ao tentar remover um estudante que não está na classe", () => {
    const createClassProps = dummyClassProps();
    const classEntity = Class.create(createClassProps);
    expect(classEntity.getStudentsIds()).toHaveLength(0);
    expect(() => classEntity.removeStudentId(student1.getId())).toThrow(ValidationError);
  });
});