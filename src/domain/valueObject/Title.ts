import { ValidationError } from '../error/ValidationError';

export class Title {
  private value: string;

  constructor(value: string) {
    this.value = this.validate(value);
  }

  validate(value: string): string {
    if (value.length < 6) throw new ValidationError('Title');
    return value;
  }

  getValue() {
    return this.value;
  }
}
