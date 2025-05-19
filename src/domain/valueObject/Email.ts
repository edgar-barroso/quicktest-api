import { ValidationError } from '../error/ValidationError';
export class Email {
  private value: string;

  constructor(value: string) {
    this.value = this.validate(value);
  }

  validate(email: string): string {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/m;
    if (!emailRegex.test(email)) throw new ValidationError('Email');
    return email;
  }

  getValue() {
    return this.value;
  }
}
