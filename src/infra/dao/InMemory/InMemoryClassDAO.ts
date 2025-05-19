import { ClassDAO } from '@/application/dao/ClassDAO';
import { Class } from '@/domain/entity/Class';

export class InMemoryClassDAO implements ClassDAO {
  private static instance: InMemoryClassDAO;
  items: Class[] = [];

  private constructor() {}

  static getInstance(): InMemoryClassDAO {
    if (!InMemoryClassDAO.instance) {
      InMemoryClassDAO.instance = new InMemoryClassDAO();
    }
    return InMemoryClassDAO.instance;
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
    const startIndex = (page - 1) * pageLength;
    const endIndex = startIndex + pageLength;
    const paginatedItems = this.items.slice(startIndex, endIndex);
    return Promise.resolve(
      paginatedItems.map((classItem) => ({
        id: classItem.getId(),
        title: classItem.getTitle(),
        teacherId: classItem.getTeacherId(),
        studentsIds: classItem.getStudentsIds(),
        createdAt: classItem.getCreatedAt(),
      })),
    );
  }
}
