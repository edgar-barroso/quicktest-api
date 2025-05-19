import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '@/infra/repository/Prisma/PrismaUserRepository';
import { PrismaUserDAO } from '@/infra/dao/Prisma/PrismaUserDAO';
import { PrismaQuestionRepository } from '@/infra/repository/Prisma/PrismaQuestionRepository';
import { PrismaQuestionDAO } from '@/infra/dao/Prisma/PrismaQuestionDAO';
import { PrismaExamRepository } from '@/infra/repository/Prisma/PrismaExamRepository';
import { PrismaExamDAO } from '@/infra/dao/Prisma/PrismaExamDAO';
import { PrismaClassDAO } from '@/infra/dao/Prisma/PrismaClassDAO';
import { PrismaClassRepository } from '@/infra/repository/Prisma/PrismaClassRepository';
import { PrismaExamAttemptRepositoy } from '@/infra/repository/Prisma/PrismaExamAttemptRepository';

@Module({
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: () => {
        const prisma = new PrismaClient();
        return prisma;
      },
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaUserRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'USER_DAO',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaUserDAO(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'QUESTION_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaQuestionRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'QUESTION_DAO',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaQuestionDAO(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'EXAM_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaExamRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'EXAM_DAO',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaExamDAO(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'CLASS_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaClassRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'CLASS_DAO',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaClassDAO(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'EXAMATTEMPT_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaExamAttemptRepositoy(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
  ],
  exports: [
    'USER_REPOSITORY',
    'USER_DAO',
    'QUESTION_REPOSITORY',
    'QUESTION_DAO',
    'EXAM_REPOSITORY',
    'EXAM_DAO',
    'CLASS_REPOSITORY',
    'CLASS_DAO',
    'EXAMATTEMPT_REPOSITORY'
  ],
})
export class DatabaseModule {}
