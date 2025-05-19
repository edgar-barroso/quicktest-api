import { User } from '../entity/User';

export interface UserRepository {
  update(user: User): Promise<User>;
  delete(user: User): Promise<User>;
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
}
