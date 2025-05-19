import { ValidationError } from "@/domain/error/ValidationError";
import { Password } from "@/domain/valueObject/Password";

describe("Password", () => {
  test("deve criar uma instância válida de Password", () => {
    const plainTextPassword = "senha123";
    const password = new Password(plainTextPassword);
    expect(password).toBeDefined();
  });

  test("deve lançar um erro ao criar uma instância inválida de Password", () => {
    expect(() => new Password("senha invalid @-")).toThrow(
      new ValidationError("Invalid password"),
    );
  });
});
