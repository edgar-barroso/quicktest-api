import { ValidationError } from '../error/ValidationError';
import { Description } from '../valueObject/Description';
import { UniqueEntityId } from '../valueObject/UniqueEntityId';

export class Choice {
  private id:UniqueEntityId
  constructor(
    private readonly text: string,
    private readonly isCorrect: boolean,
    id?:string
  ) {
    this.id = new UniqueEntityId(id)

  }
  getText():string{
    return this.text
  }
  getIsCorrect():boolean{
    return this.isCorrect
  }
  getId():string{
    return this.id.getValue()
  }
}

export interface CreateQuestionProps {
  id?: string;
  authorId: string;
  choices: Choice[];
  description: string;
  createdAt?: Date;
}

export class Question {

  private readonly id: UniqueEntityId;
  private readonly authorId: string;
  private readonly choices: Choice[];
  private readonly description: Description;
  private readonly createdAt: Date;

  private constructor(
    description: string,
    choices: Choice[],
    authorId: string,
    createdAt: Date = new Date(),
    id?: string,
  ) {

    if (choices.length < 2) {
      throw new ValidationError('Question must have at least 2 choices');
    }
    this.id = new UniqueEntityId(id);
    this.description = new Description(description);
    this.choices = choices;
    this.authorId = authorId;
    this.createdAt = createdAt;
  }

  public static create(props: CreateQuestionProps): Question {
    return new Question(
      props.description,
      props.choices,
      props.authorId,
      props.createdAt,
      props.id
    );
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getDescription(): string {
    return this.description.getValue();
  }

  public getChoices(): Choice[] {
    return [...this.choices];
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getAuthorId(): string {
    return this.authorId;
  }
}
