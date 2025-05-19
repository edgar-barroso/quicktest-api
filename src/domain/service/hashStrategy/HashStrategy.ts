export interface HashStrategy {
  hash(plainTextPassword: string): string;
  verify(hashedValue: string, plainTextPassword: string): boolean;
}
