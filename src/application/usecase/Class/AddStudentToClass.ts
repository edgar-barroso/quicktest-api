import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { UserRepository } from "@/domain/repository/UserRepository";

export interface AddStudentToClassInput {
  id: string;
  teacherId: string;
  studentId: string;
}

export interface AddStudentToClassOutput {
  classId: string;
}

export class AddStudentToClass {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: AddStudentToClassInput): Promise<AddStudentToClassOutput> {
    const teacher = await this.userRepository.findById(input.teacherId);
    if(!teacher) {
      throw new UserNotFoundError();
    }
    if (!teacher.isTeacher()) {
      throw new UnauthorizedError('Only teachers can add students to classes.');
    }
    const student = await this.userRepository.findById(input.studentId);
    if (!student) {
      throw new UserNotFoundError();
    }
    if (!student.isStudent()) {
      throw new UnauthorizedError('Only students can be added to classes.');
    }

    const classEntity = await this.classRepository.findById(input.id);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }

    if(classEntity.getTeacherId() !== input.teacherId) {
      throw new UnauthorizedError('Only the teacher of this class can add students.');
    }
    
    classEntity.addStudentId(student.getId());

    await this.classRepository.update(classEntity);
    
    return { classId: classEntity.getId() };
  }
}