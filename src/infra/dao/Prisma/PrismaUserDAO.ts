import { UserDAO } from '@/application/dao/UserDAO';
import { User } from '@/domain/entity/User';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

export class PrismaUserDAO implements UserDAO {
  private readonly user:PrismaClient['user'];
   
  constructor(prisma:PrismaClient) {
    this.user = prisma.user;

  }

  async findAll(
    page: number,
    itemsPerPage: number,
  ): Promise<{ name: string; email: string }[]> {
        const users = await this.user.findMany({
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            select: {
                name: true,
                email: true,
            },
        })
        return users
  }
}
