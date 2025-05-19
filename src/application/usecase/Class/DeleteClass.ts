import { ClassRepository } from "@/domain/repository/ClassRepository";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

export interface DeleteClassInput {
  id: string;
  teacherId: string;
}

export interface DeleteClassOutput {
  id: string;
}

export class DeleteClass {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(input: DeleteClassInput): Promise<DeleteClassOutput> {
    const classEntity = await this.classRepository.findById(input.id);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }

    if (classEntity.getTeacherId() !== input.teacherId) {
      throw new UnauthorizedError("Only the teacher of this class can delete it.");
    }

    const deletedClass =await this.classRepository.delete(classEntity);

    return { id: deletedClass.getId() };
  }
}