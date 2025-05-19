import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { UpdateUser } from "@/application/usecase/User/UpdateUser";
import { User } from "@/domain/entity/User";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";

let sut: UpdateUser;
let user:User
let userRepository: UserRepository;
beforeEach(async () => {
  userRepository = new InMemoryUserRepository();
  sut = new UpdateUser(userRepository);
  user = User.create({
    email: "johndoeexist@gmail.com",
    name: "john doe",
    password: "johndoe1234",
    role: "TEACHER"
  })
  await userRepository.create(user);
});

describe("UpdateUser", () => {
  test("Deve ser possivel atualizar um usuário", async () => {
    const input = {
      id: user.getId(),
      email: "johndoe@gmail.com",
      name: "john doe",
      password: "johndoe1234",
    };
    const output = await sut.execute(input);
    expect(output).toMatchObject({ name: input.name, email: input.email });
  });

  test("Deve deve levantar um erro ao tentar atualizar um usuário que não existe", async () => {
    const input = {
      id: "notexistsid",
      email: "johndoe@gmail.com",
      name: "john doe",
      password: "johndoe1234",
    };
    expect(async()=>await sut.execute(input)).rejects.toThrow(UserNotFoundError)
  });
  
});
