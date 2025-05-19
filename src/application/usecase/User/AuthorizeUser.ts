import { UserRepository } from '@/domain/repository/UserRepository';
import { UnauthorizedError } from '../../error/UnauthorizedError';
import { UserNotFoundError } from '../../error/UserNotFoundError';

export interface AuthorizeUserInput {
  email: string;
  password: string;
}

export interface AuthorizeUserOutput {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class AuthorizeUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthorizeUserInput): Promise<AuthorizeUserOutput> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UserNotFoundError();
    const passwordIsValid = user.getPassword().matches(password);
    if (!passwordIsValid) throw new UnauthorizedError('password');
    return { name: user.getName(), email: user.getEmail(), id: user.getId() , role: user.getRole() };
  }
}
