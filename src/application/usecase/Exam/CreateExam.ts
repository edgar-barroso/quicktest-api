import { Exam } from '@/domain/entity/Exam';
import { UserRepository } from '@/domain/repository/UserRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { QuestionNotFoundError } from '@/application/error/QuestionNotFoundError';
import { UserNotFoundError } from '@/application/error/UserNotFoundError';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';
import { ClassNotFoundError } from '@/application/error/ClassNotFoundError';

export interface CreateExamInput {
  title: string;
  description: string;
  authorId: string;
  classId: string;
  openDate?: Date;
  closeDate: Date;
  questionsIds: string[];
}

export interface CreateExamOutput {
  id: string;
}

export class CreateExam {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userRepository: UserRepository,
    private readonly examRepository: ExamRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(input: CreateExamInput): Promise<CreateExamOutput> {
    const author = await this.userRepository.findById(input.authorId);
    if (!author) {
      throw new UserNotFoundError();
    }
    const classEntity = await this.classRepository.findById(input.classId);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }

    if (classEntity.getTeacherId() !== author.getId()) {
      throw new UnauthorizedError('User is not the teacher of this class');
    }

    const questions = await Promise.all(
      input.questionsIds.map(async (questionId) => {
        const question = await this.questionRepository.findById(questionId);
        if (!question) {
          throw new QuestionNotFoundError();
        }
        return question;
      }
    ));
   const exam = Exam.create({
     title: input.title,
     description: input.description,
     authorId: author.getId(),
     questionsIds: questions.map((question) => question.getId()),
     openDate: input.openDate,
     closeDate: input.closeDate,
     classId: classEntity.getId(),
   });

    await this.examRepository.create(exam);

    return {
      id: exam.getId(),
      
    };
  }
}
