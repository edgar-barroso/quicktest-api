import { ValidationError } from '../error/ValidationError';

export class Slug {
  private value: string;

  constructor(value: string) {
    const normalized = this.toSlug(value);
    this.value = this.validate(normalized);
  }

  private toSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-')         
      .replace(/-+/g, '-');         
  }

  private validate(value: string): string {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(value)) {
      throw new ValidationError('Invalid slug format');
    }

    return value;
  }

  getValue(): string {
    return this.value;
  }
}