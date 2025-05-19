import { User } from '@/domain/entity/User';
import { UserRepository } from '@/domain/repository/UserRepository';
import { UserAlreadyExistError } from '../../error/UserAlreadyExistError';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateUserOutput {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const userAlreadyExist = await this.userRepository.findByEmail(email);
    if (userAlreadyExist) throw new UserAlreadyExistError('email');
    const user = await this.userRepository.create(
      User.create({ name, email, password, role }),
    );
    return {
      name: user.getName(),
      email: user.getEmail(),
      id: user.getId(),
      role: user.getRole(),
    };
  }
}
