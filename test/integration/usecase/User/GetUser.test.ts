import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { GetUser } from "@/application/usecase/User/GetUser";
import { User } from "@/domain/entity/User";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";

let sut: GetUser;
let user: User;
let userRepository: UserRepository;
beforeEach(async () => {
  userRepository = new InMemoryUserRepository();
  sut = new GetUser(userRepository);
  user = User.create({
    email: "johndoeexist@gmail.com",
    name: "john doe",
    password: "johndoe1234",
    role:"TEACHER"
  });
  await userRepository.create(user);
});

describe("GetUser", () => {
  test("Deve ser possivel receber um usuário", async () => {
    const input = {
      id: user.getId(),
    };
    const output = await sut.execute(input);
    expect(output).toMatchObject({
      email: "johndoeexist@gmail.com",
      name: "john doe",
    });
  });

  test("Deve deve levantar um erro ao tentar receber um usuário que não existe", async () => {
    const input = {
      id: "notexistsid",
    };
    expect(async () => await sut.execute(input)).rejects.toThrow(
      UserNotFoundError
    );
  });
});
