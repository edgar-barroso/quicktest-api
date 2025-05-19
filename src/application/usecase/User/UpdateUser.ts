import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { UserRepository } from '@/domain/repository/UserRepository';

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserOutput {
  name: string;
  email: string;
}

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}
  async execute({
    id,
    email,
    name,
    password,
  }: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    if (email) user.setEmail(email);
    if (name) user.setName(name);
    if (password) user.setPassword(password);
    const updatedUser = await this.userRepository.update(user);
    return {
      name: updatedUser.getName(),
      email: updatedUser.getEmail(),
    };
  }
}
