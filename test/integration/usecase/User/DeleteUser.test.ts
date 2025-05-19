import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { DeleteUser } from "@/application/usecase/User/DeleteUser";
import { User } from "@/domain/entity/User";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";

let sut: DeleteUser;
let user: User;
let userRepository: UserRepository;
beforeEach(async () => {
  userRepository = new InMemoryUserRepository();
  sut = new DeleteUser(userRepository);
  user = User.create({
    email: "johndoeexist@gmail.com",
    name: "john doe",
    password: "johndoe1234",
    role:"STUDENT"
  });
  await userRepository.create(user);
});

describe("DeleteUser", () => {
  test("Deve ser possivel deletar um usuário", async () => {
    const input = {
      id: user.getId(),
    };
    const output = await sut.execute(input);
    expect(output).toMatchObject({
      email: "johndoeexist@gmail.com",
      name: "john doe",
    });
  });

  test("Deve deve levantar um erro ao tentar deletar um usuário que não existe", async () => {
    const input = {
      id: "notexistsid",
    };
    expect(async () => await sut.execute(input)).rejects.toThrow(
      UserNotFoundError
    );
  });
});
