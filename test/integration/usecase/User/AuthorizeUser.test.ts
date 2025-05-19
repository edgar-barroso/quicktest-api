import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { AuthorizeUser } from "@/application/usecase/User/AuthorizeUser";
import { User } from "@/domain/entity/User";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { UserRepository } from "@/domain/repository/UserRepository";


let sut: AuthorizeUser;
let userRepository: UserRepository;

beforeEach(async () => {
  userRepository = new InMemoryUserRepository();
  sut = new AuthorizeUser(userRepository);
  await userRepository.create(
    User.create({
      email: "johndoe@gmail.com",
      name: "john doe",
      password: "johndoe1234",
      role:"STUDENT"
    }),
  );
});

describe("AuthorizeUser", () => {
  test("Deve ser possivel autorizar um usuário", async () => {
    const input = { email: "johndoe@gmail.com", password: "johndoe1234" };
    const output = await sut.execute(input);
    expect(output).toMatchObject({ name: "john doe", email: input.email });
  });

  test("Deve levantar um erro ao tentar autorizar um usuário inexistente", async () => {
    const input = {
      email: "notexists@gmail.com",
      password: "123456",
    };
    expect(async () => await sut.execute(input)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test("Deve levantar um erro ao tentar autorizar um usuário com senha inválida", async () => {
    const input = { email: "johndoe@gmail.com", password: "invalidPassword" };
    expect(async () => await sut.execute(input)).rejects.toThrow(
      new UnauthorizedError("password"),
    );
  });
});
