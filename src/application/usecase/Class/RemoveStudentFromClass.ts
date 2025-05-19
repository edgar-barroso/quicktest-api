import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { UserRepository } from "@/domain/repository/UserRepository";

export interface RemoveStudentFromClassInput {
  id: string;
  teacherId: string;
  studentId: string;
}

export interface RemoveStudentFromClassOutput {
  id: string;
}

export class RemoveStudentFromClass {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RemoveStudentFromClassInput): Promise<RemoveStudentFromClassOutput> {
    const teacher = await this.userRepository.findById(input.teacherId);
    if (!teacher || !teacher.isTeacher()) {
      throw new UnauthorizedError('Only teachers can remove students from classes.');
    }

    const student = await this.userRepository.findById(input.studentId);
    if (!student || !student.isStudent()) {
      throw new UserNotFoundError();
    }

    const classEntity = await this.classRepository.findById(input.id);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }

    classEntity.removeStudentId(student.getId());

    await this.classRepository.update(classEntity);

    return { id: classEntity.getId() };
  }
}