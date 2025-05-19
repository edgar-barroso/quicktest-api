export class UserAlreadyExistError extends Error {
  constructor(message?: string) {
    super(`User already exist${message && ` with ${message}`}`);
  }
}
