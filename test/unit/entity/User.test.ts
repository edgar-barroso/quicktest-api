import { User } from "@/domain/entity/User";
import { ValidationError } from "@/domain/error/ValidationError";
import { dummyUserProps } from "../../utils";

describe("User", () => {
  test("Deve ser possivel criar um usuário", () => {
    const userProps = dummyUserProps();
    const user = User.create(userProps);
    expect(user.getName()).toBe(user.getName());
    expect(user.getEmail()).toBe(user.getEmail());
    const isMatch = user.getPassword().matches(userProps.password);
    expect(isMatch).toBeTruthy();
  });

  test("Deve falhar ao validar email do usuário", () => {
    const userProps = dummyUserProps({email:"invalid_email"});
    expect(() => User.create(userProps)).toThrow(
      ValidationError,
    );
  });

  test("Deve falhar ao validar senha do usuário", () => {
    const userProps = dummyUserProps({password: "131-d2=1s"});
    expect(() => User.create(userProps)).toThrow(
      ValidationError,
    );
  });
});
