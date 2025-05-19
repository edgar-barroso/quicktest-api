import { BcryptHashStrategy } from "@/domain/service/hashStrategy/BcryptHashStrategy";

describe("BcryptHashStrategy", () => {
  test("deve criar uma instância válida de BcryptHashStrategy", () => {
    const hashStategy = new BcryptHashStrategy();
    expect(hashStategy).toBeTruthy();
  });

  test("deve criar uma hash e retornar true validar", () => {
    const hashStategy = new BcryptHashStrategy();
    const plainTextPassword = "plainTextPassword";
    const hashValue = hashStategy.hash(plainTextPassword);
    expect(hashStategy.verify(plainTextPassword, hashValue)).toBeTruthy();
  });

  test("deve criar uma hash e retornar false ao validar", () => {
    const hashStategy = new BcryptHashStrategy();
    const plainTextPassword = "plainTextPassword";
    const hashValue = hashStategy.hash(plainTextPassword);
    expect(hashStategy.verify("OtherPlainTextPassword", hashValue)).toBeFalsy();
  });
});
