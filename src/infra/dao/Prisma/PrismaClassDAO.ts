import { ClassDAO } from '@/application/dao/ClassDAO';
import { PrismaClient } from '@prisma/client';

export class PrismaClassDAO implements ClassDAO {
  private readonly class: PrismaClient['class'];

  constructor(private readonly prisma: PrismaClient) {
    this.class = prisma.class;
  }

  async findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      title: string;
      teacherId: string;
      studentsIds: string[];
      createdAt: Date;
    }[]
  > {
    const classes = await this.class.findMany({
      skip: (page - 1) * pageLength,
      take: pageLength,
      include: {
        students: true,
      },
    });

    return classes.map((classItem) => ({
      id: classItem.id,
      title: classItem.title,
      teacherId: classItem.teacherId,
      studentsIds: classItem.students.map((student) => student.id),
      createdAt: classItem.createdAt,
    }));
  }
}