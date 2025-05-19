import { User } from '@/domain/entity/User';
import { UserRepository } from '@/domain/repository/UserRepository';
import { PrismaUserMapper } from './Mappers/PrismaUserMapper';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  private readonly user:PrismaClient['user'];

  constructor(prisma:PrismaClient) {
    this.user = prisma.user;
  }

  async create(user: User): Promise<User> {
    await this.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
    return user;
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.user.update({
      where: { id: user.getId() },
      data: PrismaUserMapper.toPrisma(user),
    });
    return PrismaUserMapper.toDomain(updatedUser);
  }

  async delete(user: User): Promise<User> {
    const deletedUser = await this.user.delete({
      where: { id: user.getId() },
    });
    return PrismaUserMapper.toDomain(deletedUser);
  }

  async findById(id: string): Promise<User | undefined> {
    const userPrisma = await this.user.findUnique({
      where: { id },
    });
    return userPrisma ? PrismaUserMapper.toDomain(userPrisma) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userPrisma = await this.user.findUnique({
      where: { email },
    });
    return userPrisma ? PrismaUserMapper.toDomain(userPrisma) : undefined;
  }

  async findAll(): Promise<User[]> {
    const usersPrisma = await this.user.findMany();
    return usersPrisma.map(PrismaUserMapper.toDomain);
  }
}