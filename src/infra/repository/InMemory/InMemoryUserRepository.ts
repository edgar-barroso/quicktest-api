import { User } from '@/domain/entity/User';
import { UserRepository } from '@/domain/repository/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private static instance: InMemoryUserRepository;
  items: User[] = [];

  constructor() {}

  static getInstance() {
    if (!InMemoryUserRepository.instance)
      InMemoryUserRepository.instance = new InMemoryUserRepository();
    return InMemoryUserRepository.instance;
  }

  async update(user: User): Promise<User> {
    const index = this.items.findIndex((item) => item.getId() === user.getId());
    if (index !== -1) {
      this.items[index] = user;
    }
    return user;
  }

  async delete(user: User): Promise<User> {
    const index = this.items.findIndex((item) => item.getId() === user.getId());
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return user;
  }

  async create(user: User): Promise<User> {
    this.items.push(user);
    return this.items[this.items.length - 1];
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.items.find((item) => {
      return item.getId() === id;
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.items.find((item) => {
      return item.getEmail() === email;
    });
    return user;
  }
}
