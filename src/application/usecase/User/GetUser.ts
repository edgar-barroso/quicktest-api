import { UserRepository } from '@/domain/repository/UserRepository';
import { UserNotFoundError } from '../../error/UserNotFoundError';

export interface GetUserInput {
  id: string;
}

export interface GetUserOutput {
  name: string;
  email: string;
}

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return { name: user.getName(), email: user.getEmail() };
  }
}
