import { Class } from '@/domain/entity/Class';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { PrismaClient } from '@prisma/client';
import { PrismaClassMapper } from './Mappers/PrismaClassMapper';

export class PrismaClassRepository implements ClassRepository {
  private readonly class: PrismaClient['class'];

  constructor(private readonly prisma: PrismaClient) {
    this.class = prisma.class;
  }

  async findById(id: string): Promise<Class | undefined> {
    const classPrisma = await this.prisma.class.findUnique({
      where: { id },
      include: { students: true }, 
    });

    if (!classPrisma) return undefined;

    const studentsIds = classPrisma.students.map((student) => student.id);
    return PrismaClassMapper.toDomain({ ...classPrisma, studentsIds });
  }

async create(item: Class): Promise<Class> {
  const { studentsIds, ...classPrisma } = PrismaClassMapper.toPrisma(item);

  await this.prisma.class.create({
    data: {
      ...classPrisma,
      students: {
        connect: studentsIds.map((id) => ({ id })), 
      },
    },
  });

  return item;
}

  async update(item: Class): Promise<Class> {
    const classPrisma = PrismaClassMapper.toPrisma(item);

    const existingClass = await this.prisma.class.findUnique({
      where: { id: classPrisma.id },
      include: { students: true },
    });

    if (!existingClass) {
      throw new Error(`Class with ID ${classPrisma.id} not found`);
    }

    const existingStudentIds = existingClass.students.map((student) => student.id);

    const studentsToConnect = item.getStudentsIds().filter((id) => !existingStudentIds.includes(id));
    const studentsToDisconnect = existingStudentIds.filter((id) => !item.getStudentsIds().includes(id));

    await this.prisma.class.update({
      where: { id: classPrisma.id },
      data: {
        ...classPrisma,
        students: {
          connect: studentsToConnect.map((id) => ({ id })), 
          disconnect: studentsToDisconnect.map((id) => ({ id })),
        },
      },
    });

    return item;
  }

  async delete(item: Class): Promise<Class> {
    await this.prisma.class.delete({
      where: { id: item.getId() },
    });

    return item;
  }
}