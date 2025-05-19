export class QuestionAlreadyExistError extends Error {
    constructor(message?: string) {
      super(`Question already exist${message && ` with ${message}`}`);
    }
  }
  