import { Email } from '../valueObject/Email';
import { Name } from '../valueObject/Name';
import { Password } from '../valueObject/Password';
import { Role } from '../valueObject/Role';
import { UniqueEntityId } from '../valueObject/UniqueEntityId';

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  id?: string;
  isPasswordHash?: boolean;
}

export class User {

  private readonly id: UniqueEntityId;
  private name: Name;
  private email: Email;
  private password: Password;
  private role: Role;
  private readonly createdAt: Date;

  private constructor(
    name: string,
    email: string,
    password: Password,
    role: string,
    createdAt: Date = new Date(),
    id?: string,
  ) {
    this.id = new UniqueEntityId(id);
    this.name = new Name(name);
    this.email = new Email(email);
    this.password = password;
    this.role = new Role(role);
    this.createdAt = createdAt;
  }

  public static create(props: CreateUserProps): User {
    return new User(
      props.name,
      props.email,
      new Password(props.password, props.isPasswordHash),
      props.role,
      props.createdAt,
      props.id,
    );
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getName(): string {
    return this.name.getValue();
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getPassword(): Password {
    return this.password;
  }

  public getRole(): string {
    return this.role.getValue();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setName(name: string): void {
    this.name = new Name(name);
  }

  public setEmail(email: string): void {
    this.email = new Email(email);
  }

  public setPassword(password: string, isHashed: boolean = false): void {
    this.password = new Password(password, isHashed);
  }

  public setRole(role: string): void {
    this.role = new Role(role);
  }

  isTeacher() {
    return this.role.getValue() === 'TEACHER';
  }

  isStudent() {
    return this.role.getValue() === 'STUDENT';
  }
}