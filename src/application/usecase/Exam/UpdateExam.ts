import { ExamNotFoundError } from '@/application/error/ExamNotFoundError';
import { UnauthorizedError } from '@/application/error/UnauthorizedError';
import { Exam } from '@/domain/entity/Exam';
import { ExamRepository } from '@/domain/repository/ExamRepository';

export interface UpdateExamInput {
  userId: string;
  id: string;
  title?: string;
  description?: string;
  questionsIds?: string[];
  closeDate?: Date;
  openDate?: Date;
}

export interface UpdateExamOutput {
  id: string;
  title: string;
  description: string;
  classId: string;
  authorId: string;
  closeDate: Date;
  openDate: Date;
  questionsIds: string[];
}

export class UpdateExam {
  constructor(
    private readonly examRepository: ExamRepository,
  ) {}

  async execute(input: UpdateExamInput): Promise<UpdateExamOutput> {
    const existingExam = await this.examRepository.findById(input.id);

    if (!existingExam) {
      throw new ExamNotFoundError();
    }

    if (input.userId !== existingExam.getAuthorId()) {
      throw new UnauthorizedError('You are not authorized to update this exam');
    }


    const updatedExam = Exam.create({
      id: existingExam.getId(),
      title: input.title || existingExam.getTitle(),
      authorId: existingExam.getAuthorId(),
      description: input.description || existingExam.getDescription(),
      questionsIds: input.questionsIds || existingExam.getQuestionsIds(),
      createdAt: existingExam.getCreatedAt(),
      closeDate: input.closeDate || existingExam.getCloseDate(),
      openDate: input.openDate || existingExam.getOpenDate(),
      classId: existingExam.getClassId(),
    });

    await this.examRepository.update(updatedExam);

    return {
      id: updatedExam.getId(),
      title: updatedExam.getTitle(),
      description: updatedExam.getDescription(),
      authorId: updatedExam.getAuthorId(),
      classId: updatedExam.getClassId(),
      openDate: updatedExam.getOpenDate(),
      closeDate: updatedExam.getCloseDate(),
      questionsIds: updatedExam.getQuestionsIds(),
    };
  }
}