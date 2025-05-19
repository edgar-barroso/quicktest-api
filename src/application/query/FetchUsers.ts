import { env } from '@/env';
import { UserDAO } from '../dao/UserDAO';

export interface FetchUserInput {
  page: number;
  pageLength?: number;
}

export interface FetchUserOutput {
  users: { name: string; email: string }[];
}

export class FetchUsers {
  constructor(private readonly userDAO: UserDAO) {}

  async execute({
    page,
    pageLength,
  }: FetchUserInput): Promise<FetchUserOutput> {
    const users = await this.userDAO.findAll(
      page,
      pageLength ||env.MAX_PAGE_LENGTH,
    );
    return { users };
  }
}
