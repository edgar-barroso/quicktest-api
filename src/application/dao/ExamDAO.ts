export interface ExamDAO {
  findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      authorId: string;
      title: string;
      description: string;
      classId:string;
      openDate: Date;
      closeDate: Date;
      createdAt: Date;
      questionsIds: string[];
    }[]
  >;
}
