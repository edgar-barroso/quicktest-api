import { ValidationError } from "@/domain/error/ValidationError";
import { Email } from "@/domain/valueObject/Email";

describe("Email", () => {
  test("deve criar uma instância válida de Email", () => {
    const cpf = new Email("edgarbarroso@gmail.com");
    expect(cpf.getValue()).toBe("edgarbarroso@gmail.com");
  });

  test("deve lançar um erro ao criar uma instância inválida de Email", () => {
    expect(() => new Email("aokfo@.com")).toThrow(
      new ValidationError("Email"),
    );
  });
});
