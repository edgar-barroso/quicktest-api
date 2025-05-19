export class ExamNotFoundError extends Error {
    constructor() {
      super("Exam not found");
    }
  }