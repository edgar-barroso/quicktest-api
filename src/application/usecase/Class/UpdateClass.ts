import { ClassRepository } from "@/domain/repository/ClassRepository";
import { ClassNotFoundError } from "@/application/error/ClassNotFoundError";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";

export interface UpdateClassInput {
  id: string;
  teacherId: string;
  title?: string;
}

export interface UpdateClassOutput {
  id: string;
  teacherId: string;
  title: string;
}

export class UpdateClass {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(input: UpdateClassInput): Promise<UpdateClassOutput> {
    const classEntity = await this.classRepository.findById(input.id);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }
    if(classEntity.getTeacherId() !== input.teacherId) {
      throw new UnauthorizedError("You are not authorized to update this class");
    }

    classEntity.setTitle(input.title || classEntity.getTitle());

    const updatedClass = await this.classRepository.update(classEntity);

    return {
      id: updatedClass.getId(),
      title: updatedClass.getTitle(),
      teacherId: updatedClass.getTeacherId(),
    };
  }
}