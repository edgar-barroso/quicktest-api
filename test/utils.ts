import { CreateClassProps } from '@/domain/entity/Class';
import { Choice, CreateQuestionProps } from '@/domain/entity/Question';
import { CreateUserProps, User } from '@/domain/entity/User';
import { faker } from '@faker-js/faker';

export const dummyUserProps = (input?: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): CreateUserProps => {
  if (!input)
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 20, memorable: true,pattern:/^[a-zA-Z0-9]+$/ }),
      role: faker.helpers.arrayElement(['STUDENT', 'TEACHER']),
    };
  const { name, email, password, role } = input;
  return {
    name: name ||faker.person.fullName(),
    email: email ||faker.internet.email(),
    password: password ||faker.internet.password({ length: 20, memorable: true,pattern:/^[a-zA-Z0-9]+$/ }),
    role: role ||faker.helpers.arrayElement(['STUDENT', 'TEACHER']),
  };
};


export const dummyClassProps = (input?:
  { title?: string;
  teacherId?: string;
  studentsIds?: string[];
}
):CreateClassProps =>{
  if(!input){
    return {
      title:"class " + faker.lorem.text(),
      teacherId:"teacher-"+ new UniqueEntityId().getValue(),
    }
  }
  return {
    title: input.title || "class " + faker.lorem.text(),
    teacherId:input.teacherId || "teacher-"+ new UniqueEntityId().getValue(),
  }
  
}

export const dummyQuestionProps = (input?: {
  authorId?: string;
  choices?: Choice[];
  description?: string;
}):CreateQuestionProps =>{
    if(!input){
      return {
        authorId:"author " + new UniqueEntityId().getValue(),
        choices:[
          new Choice(faker.lorem.text(),true),
          new Choice(faker.lorem.text(),false),
        ],
        description: faker.lorem.sentence(),
      }
    }

    return {
      authorId: input.authorId || "author " + new UniqueEntityId().getValue(),
      choices: input.choices || [
        new Choice(faker.lorem.text(), true),
        new Choice(faker.lorem.text(), false),
      ],
      description: input.description || faker.lorem.sentence(),
    }
  }

  import { CreateExamProps } from '@/domain/entity/Exam';
import { Answer, ExamAttemptProps } from '@/domain/entity/ExamAttempt';
import { UniqueEntityId } from '@/domain/valueObject/UniqueEntityId';
import { prisma } from '@/lib/prisma';

  export const dummyExamProps = (input?: {
    title?: string;
    description?: string;
    authorId?: string;
    questionsIds?: string[];
    classId?: string;
    createdAt?: Date;
    closeDate?: Date;
    openDate?: Date;
  }): CreateExamProps => {
    if (!input) {
      return {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        authorId: `author-${new UniqueEntityId().getValue()}`,
        questionsIds: [],
        classId: `class-${new UniqueEntityId().getValue()}`,
        createdAt: new Date(),
        closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 dia depois
        openDate: new Date(),
      };
    }
  
    return {
      title: input.title || faker.lorem.words(3),
      description: input.description || faker.lorem.sentence(),
      authorId: input.authorId || `author-${new UniqueEntityId().getValue()}`,
      questionsIds: input.questionsIds || [],
      classId: input.classId || `class-${new UniqueEntityId().getValue()}`,
      createdAt: input.createdAt || new Date(),
      closeDate: input.closeDate || new Date(Date.now() + 1000 * 60 * 60 * 24),
      openDate: input.openDate || new Date(),
    };
  };

  export const dummyExamAttemptProps = (input?: {
    examId?: string;
    studentId?: string;
    answers?: Answer[];
    startedAt?: Date;
    finishedAt?: Date;
  }): ExamAttemptProps => {
    const answers = input?.answers || [
      new Answer( 'question-1', 'choice-1'),
      new Answer( 'question-2', 'choice-2'),
    ];
  
    return {
      examId: input?.examId || `exam-${new UniqueEntityId().getValue()}`,
      studentId: input?.studentId || `student-${new UniqueEntityId().getValue()}`,
      answers,
      startedAt: input?.startedAt || new Date(),
      finishedAt: input?.finishedAt,
    };
  };

  export const clearDataBase = async () => {
    await prisma.examAttempt.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.question.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();
  }