import { UserRepository } from '@/domain/repository/UserRepository';
import { UserNotFoundError } from '../../error/UserNotFoundError';

export interface DeleteUserInput {
  id: string;
}

export interface DeleteUserOutput {
  name: string;
  email: string;
}

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: DeleteUserInput): Promise<DeleteUserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    const deletedUser = await this.userRepository.delete(user);
    return { name: deletedUser.getName(), email: deletedUser.getEmail() };
  }
}
