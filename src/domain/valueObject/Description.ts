import { ValidationError } from '../error/ValidationError';

export class Description {
  private value: string;

  constructor(value: string) {
    this.value = this.validate(value);
  }

  validate(value: string): string {
    if (value.length < 6) throw new ValidationError('Description');
    return value;
  }

  getValue() {
    return this.value;
  }
}
