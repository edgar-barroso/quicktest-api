import { env } from '@/env';
import { ClassDAO } from '../dao/ClassDAO';

export interface FetchClassesInput {
  page: number;
  pageLength?: number;
}

export interface FetchClassesOutput {
  classes: {
    id: string;
    title: string;
    teacherId: string;
    studentsIds: string[];
    createdAt: Date;
  }[];
}

export class FetchClasses {
  constructor(private readonly classDAO: ClassDAO) {}

  async execute({
    page,
    pageLength,
  }: FetchClassesInput): Promise<FetchClassesOutput> {
    const classes = await this.classDAO.findAll(
      page,
      pageLength ||env.MAX_PAGE_LENGTH,
    );

    return { classes };
  }
}
