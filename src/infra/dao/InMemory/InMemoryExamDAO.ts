import { ExamDAO } from '@/application/dao/ExamDAO';
import { Exam } from '@/domain/entity/Exam';

export class InMemoryExamDAO implements ExamDAO {
  private static instance: InMemoryExamDAO;
  items: Exam[] = [];

  private constructor() {}

  static getInstance(): InMemoryExamDAO {
    if (!InMemoryExamDAO.instance) {
      InMemoryExamDAO.instance = new InMemoryExamDAO();
    }
    return InMemoryExamDAO.instance;
  }

  async findAll(
    page: number,
    itemsPerPage: number,
  ):Promise<
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
  >{
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = this.items.slice(startIndex, endIndex);
    return paginatedItems.map((exam) => ({
      id: exam.getId(),
      authorId: exam.getAuthorId(),
      title: exam.getTitle(),
      description: exam.getDescription(),
      classId: exam.getClassId(),
      openDate: exam.getOpenDate(),
      closeDate: exam.getCloseDate(),
      createdAt: exam.getCreatedAt(),
      questionsIds: exam.getQuestionsIds(),
    }));
  }
}