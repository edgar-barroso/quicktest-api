import * as bcrypt from 'bcrypt';
import { HashStrategy } from './HashStrategy';
export class BcryptHashStrategy implements HashStrategy {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 6) {
    this.saltRounds = saltRounds;
  }

  hash(plainTextPassword: string) {
    return bcrypt.hashSync(plainTextPassword, this.saltRounds);
  }

  verify(plainTextPassword: string, hashedValue: string) {
    return bcrypt.compareSync(plainTextPassword, hashedValue);
  }
}
