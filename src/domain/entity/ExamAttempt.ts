import { ValidationError } from '../error/ValidationError';
import { UniqueEntityId } from '../valueObject/UniqueEntityId';

export class Answer {
  public id: UniqueEntityId;
  constructor(
    private readonly questionId: string,
    private choiceId: string,
    id?: string,
  ) {
    this.id = new UniqueEntityId(id);
  }
  getId(): string {
    return this.id.getValue();
  }
  getQuestionId(): string {
    return this.questionId;
  }
  getChoiceId(): string {
    return this.choiceId;
  }
  setChoiceId(choiceId: string) {
    this.choiceId = choiceId;
  }
}

export interface ExamAttemptProps {
  id?: string;
  examId: string;
  studentId: string;
  answers: Answer[];
  startedAt: Date;
  finishedAt?: Date;
}

export class ExamAttempt {
  private readonly id: UniqueEntityId;
  private readonly examId: string;
  private readonly studentId: string;
  private readonly startedAt: Date;
  private answers: Answer[];

  private constructor(
    examId: string,
    studentId: string,
    answers: Answer[],
    startedAt: Date = new Date(),
    id?: string,
  ) {
    this.id = new UniqueEntityId(id);
    this.examId = examId;
    this.studentId = studentId;
    this.startedAt = startedAt;
    this.answers = answers || [];
  }

  static create(props: ExamAttemptProps): ExamAttempt {
    return new ExamAttempt(
      props.examId,
      props.studentId,
      props.answers,
      props.startedAt,
      props.id,
    );
  }

  getStartedAt(): Date {
    return this.startedAt;
  }
  getId(): string {
    return this.id.getValue();
  }
  getExamId(): string {
    return this.examId;
  }
  getStudentId(): string {
    return this.studentId;
  }
  getAnswers(): Answer[] {
    return this.answers;
  }

  addAnswer(questionId: string, choiceId: string) {
    const existingAnswer = this.answers.find(
      (answer) => answer.getQuestionId() === questionId,
    );

    if (existingAnswer) {
      existingAnswer.setChoiceId(choiceId);
    } else {
      this.answers.push(new Answer(questionId, choiceId));
    }
  }
}
