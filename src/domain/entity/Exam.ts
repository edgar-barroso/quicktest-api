import { ValidationError } from '../error/ValidationError';
import { Description } from '../valueObject/Description';
import { Title } from '../valueObject/Title';
import { UniqueEntityId } from '../valueObject/UniqueEntityId';

export interface CreateExamProps {
  id?: string;
  title: string;
  description: string;
  authorId: string;
  questionsIds: string[];
  classId: string;
  createdAt?: Date;
  closeDate: Date;
  openDate?: Date;
}

export class Exam {
  private readonly id: UniqueEntityId;
  private readonly title: Title;
  private readonly description: Description;
  private readonly questionsIds: string[];
  private readonly createdAt: Date;
  private readonly authorId: string;
  private readonly openDate: Date;
  private readonly closeDate: Date;
  private readonly classId: string;

  private constructor(
    title: string,
    description: string,
    authorId: string,
    questionsIds: string[],
    closeDate: Date,
    classId:string,
    openDate: Date = new Date(),
    createdAt: Date = new Date(),
    id?: string,
  ) {

    if (closeDate < openDate) {
      throw new ValidationError('Close date must be after open date.');
    }

    this.id = new UniqueEntityId(id);
    this.title = new Title(title);
    this.description = new Description(description);
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.questionsIds = questionsIds;
    this.openDate = openDate;
    this.closeDate = closeDate;
    this.classId = classId;
  }

  static create(props: CreateExamProps): Exam {
    return new Exam(
      props.title,
      props.description,
      props.authorId,
      props.questionsIds,
      props.closeDate,
      props.classId,
      props.openDate,
      props.createdAt,
      props.id,

    );
  }

  public getClassId(): string {
    return this.classId;
  }

  public getId(): string {
    return this.id.getValue();
  }

  getTitle(): string {
    return this.title.getValue();
  }

  getDescription(): string {
    return this.description.getValue();
  }

  getAuthorId(): string {
    return this.authorId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getQuestionsIds(): string[] {
    return [...this.questionsIds];
  }

  getCloseDate(): Date {
    return this.closeDate;
  }

  getOpenDate(): Date {
    return this.openDate;
  }

  isAvailable(now: Date = new Date()): boolean {
    return now >= this.openDate && now <= this.closeDate;
  }
}
