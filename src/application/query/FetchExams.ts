import { env } from '@/env';
import { ExamDAO } from '../dao/ExamDAO';

export interface FetchExamsInput {
  page: number;
  pageLength?: number;
}

export interface FetchExamsOutput {
  exams: {
    id: string;
    title: string;
    description: string;
    classId: string;
    authorId: string;
    closeDate: Date;
    openDate: Date;
    questionsIds: string[];
  }[];
}

export class FetchExams {
  constructor(private readonly examDAO: ExamDAO) {}

  async execute({
    page,
    pageLength,
  }: FetchExamsInput): Promise<FetchExamsOutput> {
    const exams = await this.examDAO.findAll(
      page,
      pageLength || env.MAX_PAGE_LENGTH,
    );
    return { exams };
  }
}
