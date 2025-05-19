import { UserDAO } from '@/application/dao/UserDAO';
import { User } from '@/domain/entity/User';

export class InMemoryUserDAO implements UserDAO {
  private static instance: InMemoryUserDAO;
  items: User[] = [];

  private constructor() {}

  static getInstance(): InMemoryUserDAO {
    if (!InMemoryUserDAO.instance)
      InMemoryUserDAO.instance = new InMemoryUserDAO();
    return InMemoryUserDAO.instance;
  }

  async findAll(
    page: number,
    itemsPerPage: number,
  ): Promise<{ name: string; email: string }[]> {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = this.items.slice(startIndex, endIndex);
    return paginatedItems.map((item) => ({
      name: item.getName(),
      email: item.getEmail(),
    }));
  }
}
