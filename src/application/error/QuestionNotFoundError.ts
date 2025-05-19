export class QuestionNotFoundError extends Error {
    constructor() {
      super("Question not found");
    }
  }