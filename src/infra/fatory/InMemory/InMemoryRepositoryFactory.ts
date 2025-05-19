import { ClassDAO } from '@/application/dao/ClassDAO';
import { ExamDAO } from '@/application/dao/ExamDAO';
import { DAOFactory } from '@/application/dao/factory/DAOFactory';
import { QuestionDAO } from '@/application/dao/QuestionDAO';
import { UserDAO } from '@/application/dao/UserDAO';
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { InMemoryClassDAO } from '@/infra/dao/InMemory/InMemoryClassDAO';
import { InMemoryExamDAO } from '@/infra/dao/InMemory/InMemoryExamDAO';
import { InMemoryQuestionDAO } from '@/infra/dao/InMemory/InMemoryQuestionDAO';
import { InMemoryUserDAO } from '@/infra/dao/InMemory/InMemoryUserDAO';
import { InMemoryClassRepository } from '@/infra/repository/InMemory/InMemoryClassRepository';
import { InMemoryExamAttemptRepository } from '@/infra/repository/InMemory/InMemoryExamAttemptRepository';
import { InMemoryExamRepository } from '@/infra/repository/InMemory/InMemoryExamRepository';
import { InMemoryQuestionRepository } from '@/infra/repository/InMemory/InMemoryQuestionRepository';
import { InMemoryUserRepository } from '@/infra/repository/InMemory/InMemoryUserRepository';

export class InMemoryFactory implements RepositoryFactory, DAOFactory {
  private static instance: InMemoryFactory;

  private constructor() {}

  public static getInstance(): InMemoryFactory {
    if (!InMemoryFactory.instance)
      InMemoryFactory.instance = new InMemoryFactory();
    return InMemoryFactory.instance;
  }

  createUserDAO(): UserDAO {
    const dao = InMemoryUserDAO.getInstance();
    dao.items = InMemoryUserRepository.getInstance().items;
    return dao;
  }

  createUserRepository(): UserRepository {
    return InMemoryUserRepository.getInstance();
  }

  createQuestionRepository(): QuestionRepository {
    return InMemoryQuestionRepository.getInstance();
  }

  createExamRepository(): ExamRepository {
    return InMemoryExamRepository.getInstance();
  }

  createExamAttemptRepository(): ExamAttemptRepository {
    return InMemoryExamAttemptRepository.getInstance();
  }

  createQuestionDAO(): QuestionDAO {
    const dao = InMemoryQuestionDAO.getInstance();
    dao.items = InMemoryQuestionRepository.getInstance().items;
    return dao;
  }

  createExamDAO(): ExamDAO {
    const dao = InMemoryExamDAO.getInstance();
    dao.items = InMemoryExamRepository.getInstance().items;
    return dao;
  }

  createClassDAO(): ClassDAO {
    const dao = InMemoryClassDAO.getInstance();
    dao.items = InMemoryClassRepository.getInstance().items;
    return dao;
  }

  createClassRepository(): ClassRepository {
    return InMemoryClassRepository.getInstance();
  }
}
