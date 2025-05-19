import { Class } from '@/domain/entity/Class';
import { Class as ClassPrisma } from '@prisma/client';

export class PrismaClassMapper {
  static toPrisma(classEntity: Class): Omit<ClassPrisma, 'students'> & { studentsIds: string[] } {
    return {
      id: classEntity.getId(),
      title: classEntity.getTitle(),
      teacherId: classEntity.getTeacherId(),
      createdAt: classEntity.getCreatedAt(),
      studentsIds: classEntity.getStudentsIds(),
    };
  }

  static toDomain(
    classPrisma: Omit<ClassPrisma, 'students'> & { studentsIds: string[] }
  ): Class {
    return Class.create({
      id: classPrisma.id,
      title: classPrisma.title,
      teacherId: classPrisma.teacherId,
      createdAt: classPrisma.createdAt,
      studentsIds: classPrisma.studentsIds,
    });
  }
}