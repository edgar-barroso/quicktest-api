export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(`Unauthorized error ${message}`);
  }
}
