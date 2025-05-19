import { ValidationError } from '../error/ValidationError';
import { BcryptHashStrategy } from '../service/hashStrategy/BcryptHashStrategy';
import { HashStrategy } from '../service/hashStrategy/HashStrategy';

export class Password {
  private readonly hashedValue: string;
  private readonly hashStrategy: HashStrategy;

  constructor(
    plainTextPassword: string,
    isHash?: boolean,
    hashStrategy: HashStrategy = new BcryptHashStrategy(),
  ) {
    this.hashStrategy = hashStrategy;
    if (isHash) {
      this.hashedValue = plainTextPassword;
    } else {
      this.hashedValue = this.hashStrategy.hash(
        Password.validate(plainTextPassword),
      );
    }
  }

  private static validate(plainTextPassword: string): string {
    const regex = /^[a-zA-Z0-9]+$/;
    if (plainTextPassword.length < 6 || !regex.test(plainTextPassword)) {
      throw new ValidationError('Invalid password');
    }
    return plainTextPassword;
  }

  public getValue(): string {
    return this.hashedValue;
  }

  public matches(plainTextPassword: string): boolean {
    return this.hashStrategy.verify(plainTextPassword, this.hashedValue);
  }
}
