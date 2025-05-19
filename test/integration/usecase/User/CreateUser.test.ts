import { UserAlreadyExistError } from "@/application/error/UserAlreadyExistError";
import { CreateUser, CreateUserInput } from "@/application/usecase/User/CreateUser";
import { User } from "@/domain/entity/User";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";

let sut: CreateUser;
let userRepository: UserRepository;
beforeEach(async () => {
  userRepository = new InMemoryUserRepository();
  sut = new CreateUser(userRepository);
  await userRepository.create(
    User.create({
      email: "johndoeexist@gmail.com",
      name: "john doe",
      password: "johndoe1234",
      role:"STUDENT"
    }),
  );
});

describe("CreateUser", () => {
  test("Deve ser possivel criar um usuário", async () => {
    const input:CreateUserInput = {
      email: "johndoe@gmail.com",
      name: "john doe",
      password: "johndoe1234",
      role:"STUDENT"
    };
    const output = await sut.execute(input);
    expect(output).toMatchObject({ name: input.name, email: input.email });
    const user = await userRepository.findByEmail(input.email);
    expect(user).toBeDefined();
  });

  test("Deve levantar um erro ao tentar cadastrar 2 usuários com o mesmo email", async () => {
    const input:CreateUserInput = {
      email: "johndoeexist@gmail.com",
      name: "john doe",
      password: "johndoe1234",
      role:"STUDENT"
    };
    expect(async () => {
      await sut.execute(input);
    }).rejects.toThrow(new UserAlreadyExistError("email"));
  });
});
