export interface ClassDAO {
    findAll(
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
    >;
  }