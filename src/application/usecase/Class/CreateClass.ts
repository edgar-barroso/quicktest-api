import { Class } from "@/domain/entity/Class";
import { UserRepository } from "@/domain/repository/UserRepository";
import { ClassRepository } from "@/domain/repository/ClassRepository";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

export interface CreateClassInput {
  title: string;
  teacherId: string;
}

export interface CreateClassOutput {
  id: string;
  title: string;
  teacherId: string;
  createdAt: Date;
}

export class CreateClass {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: CreateClassInput): Promise<CreateClassOutput> {
    const teacher = await this.userRepository.findById(input.teacherId);
    if (!teacher) {
      throw new UserNotFoundError();
    }

    if (!teacher.isTeacher()) {
      throw new UnauthorizedError("Only teachers can create classes.");
    }

    const classEntity = Class.create({
      title: input.title,
      teacherId: teacher.getId(),
    });

    await this.classRepository.create(classEntity);

    return {
      id: classEntity.getId(),
      title: classEntity.getTitle(),
      teacherId: classEntity.getTeacherId(),
      createdAt: classEntity.getCreatedAt(),
    };
  }
}