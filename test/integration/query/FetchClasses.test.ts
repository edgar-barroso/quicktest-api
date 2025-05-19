import { FetchClasses } from '@/application/query/FetchClasses';
import { Class } from '@/domain/entity/Class';
import { User } from '@/domain/entity/User';
import { ClassDAO } from '@/application/dao/ClassDAO';
import { InMemoryFactory } from '@/infra/fatory/InMemory/InMemoryRepositoryFactory';
import { env } from '@/env';
import { ClassRepository } from '@/domain/repository/ClassRepository';

let sut: FetchClasses;
let classDAO: ClassDAO;
let classRepository: ClassRepository;

interface ExpectedClassOutput {
  id: string;
  title: string;
  teacherId: string;
  studentsIds: string[];
  createdAt: Date;
}

let teacher: User;

beforeEach(async () => {
  const factory = InMemoryFactory.getInstance();
  classDAO = factory.createClassDAO();
  classRepository = factory.createClassRepository();
  sut = new FetchClasses(classDAO);

  teacher = User.create({
    id: 'teacher-1',
    name: 'Teacher',
    email: 'teacher1@gmail.com',
    password: '123456',
    role: 'TEACHER',
  });

  // Create 50 sample classes
  for (let i = 0; i < 50; i++) {
    const student = User.create({
      id: `student-${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@gmail.com`,
      password: '123456',
      role: 'STUDENT',
    });

    const classEntity = Class.create({
      title: `Class Title ${i + 1}`,
      teacherId: teacher.getId(),
    });

    classEntity.addStudentId(student.getId());
    await classRepository.create(classEntity);
  }
});

describe('FetchClasses', () => {
  test('Deve ser possível receber várias turmas', async () => {
    const expectedClasses: ExpectedClassOutput[] = [];

    for (let i = 0; i < 10; i++) {
      expectedClasses.push({
        id: expect.any(String),
        title: `Class Title ${i + 1}`,
        teacherId: 'teacher-1',
        studentsIds: [`student-${i + 1}`],
        createdAt: expect.any(Date),
      });
    }

    const input = { page: 1, pageLength: 10 };
    const output = await sut.execute(input);

    expect(output.classes).toHaveLength(10);
    expect(output.classes).toEqual(expect.arrayContaining(expectedClasses));
  });

  test('Deve ser possível receber as turmas da página 2', async () => {
    const expectedClasses: ExpectedClassOutput[] = [];

    for (let i = 10; i < 20; i++) {
      expectedClasses.push({
        id: expect.any(String),
        title: `Class Title ${i + 1}`,
        teacherId: 'teacher-1',
        studentsIds: [`student-${i + 1}`],
        createdAt: expect.any(Date),
      });
    }

    const input = { page: 2, pageLength: 10 };
    const output = await sut.execute(input);

    expect(output.classes).toHaveLength(10);
    expect(output.classes).toEqual(expect.arrayContaining(expectedClasses));
  });

  test(`Deve ser possível receber o máximo de paginação permitido (${env.MAX_PAGE_LENGTH})`, async () => {
    const expectedClasses: ExpectedClassOutput[] = [];

    for (let i = 0; i < env.MAX_PAGE_LENGTH; i++) {
      expectedClasses.push({
        id: expect.any(String),
        title: `Class Title ${i + 1}`,
        teacherId: 'teacher-1',
        studentsIds: [`student-${i + 1}`],
        createdAt: expect.any(Date),
      });
    }

    const input = { page: 1 };
    const output = await sut.execute(input);

    expect(output.classes).toHaveLength(env.MAX_PAGE_LENGTH);
    expect(output.classes).toEqual(expect.arrayContaining(expectedClasses));
  });
});
