export class ExamAttemptNotFoundError extends Error {
  constructor() {
    super("Exam attempt not found");
  }
}