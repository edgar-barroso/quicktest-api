import { ClassRepository } from '@/domain/repository/ClassRepository';
import { ClassNotFoundError } from '@/application/error/ClassNotFoundError';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';

export interface GetClassInput {
  id: string;
}

export interface GetClassOutput {
  id: string;
  title: string;
  teacherId: string;
  createdAt: Date;
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  exams: {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    openDate: Date;
    closeDate: Date;
  }[];
}

export class GetClass {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository,
    private readonly examRepository: ExamRepository,
  ) {}

  async execute(input: GetClassInput): Promise<GetClassOutput> {
    const classEntity = await this.classRepository.findById(input.id);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }
    const students = await Promise.all(
      classEntity.getStudentsIds().map(async (studentId) => {
        const student = await this.userRepository.findById(studentId);
        if(!student) return null;
        return {
          id: student.getId(),
          name: student.getName(),
          email: student.getEmail(),
        };
      })
    );

    const exams = await this.examRepository.findByClassId(classEntity.getId());
    
    return {
      id: classEntity.getId(),
      title: classEntity.getTitle(),
      teacherId: classEntity.getTeacherId(),
      createdAt: classEntity.getCreatedAt(),
      students:students.filter(Boolean) as {
        id: string;
        name: string;
        email: string;
      }[],
      exams: exams.map((exam) => ({
        id: exam.getId(),
        title: exam.getTitle(),
        description: exam.getDescription(),
        createdAt: exam.getCreatedAt(),
        openDate: exam.getOpenDate(),
        closeDate: exam.getCloseDate(),
      })),
    }
  }
}
