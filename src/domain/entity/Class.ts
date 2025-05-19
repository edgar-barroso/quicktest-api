import { UniqueEntityId } from '../valueObject/UniqueEntityId';
import { Title } from '../valueObject/Title';
import { User } from './User';
import { ValidationError } from '../error/ValidationError';

export interface CreateClassProps {
  id?: string;
  title: string;
  teacherId: string;
  studentsIds?: string[];
  createdAt?: Date;
}

export class Class {

  private readonly id: UniqueEntityId;
  private title: Title;
  private readonly teacherId: string;
  private readonly studentsIds: string[];
  private readonly createdAt: Date;

  private constructor(props: CreateClassProps) {
    this.id = new UniqueEntityId(props.id);
    this.title = new Title(props.title);
    this.teacherId = props.teacherId;
    this.studentsIds = props.studentsIds || [];
    this.createdAt = props.createdAt || new Date();
  }

  public static create(props: CreateClassProps): Class {
    return new Class(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getTitle(): string {
    return this.title.getValue();
  }

  public getTeacherId(): string {
    return this.teacherId;
  }

  public getStudentsIds(): string[] {
    return this.studentsIds;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public setTitle(title: string) {
    this.title = new Title(title);
  }

  public addStudentId(studentId: string) {
    if (this.studentsIds.includes(studentId))
      throw new ValidationError('StudentId already exists');
    this.studentsIds.push(studentId);
  }

  public removeStudentId(studentId: string) {
    const studentIndex = this.studentsIds.findIndex((id) => id === studentId);
    if (studentIndex === -1) {
      throw new ValidationError('StudentId not includes');
    }
    this.studentsIds.splice(studentIndex, 1); 
  }
}
