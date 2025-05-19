import { UserDAO } from "@/application/dao/UserDAO";
import { FetchUsers } from "@/application/query/FetchUsers";
import { User } from "@/domain/entity/User";
import { UserRepository } from "@/domain/repository/UserRepository";
import { env } from "@/env";
import { InMemoryFactory } from "@/infra/fatory/InMemory/InMemoryRepositoryFactory";

let sut: FetchUsers;
let userRepository: UserRepository;
let daoRepository: UserDAO;

interface ExpectedUserOutput {
  name: string;
  email: string;
}

beforeEach(async () => {
  const factory = InMemoryFactory.getInstance()
  userRepository = factory.createUserRepository()
  daoRepository = factory.createUserDAO()
  sut = new FetchUsers(daoRepository);
  
  for(let i = 0; i < 200; i++) {
    await userRepository.create(User.create({
      name: `john doe ${i+1}`,
      email: `johndoe${i+1}@gmail.com`,
      password: "123456",
      role: i%2==0 ? "STUDENT" : "TEACHER"
    }))
  }
});

describe("FetchUsers", () => {
  test("Deve ser possivel receber varios usuários", async () => {
    const expectUsers: ExpectedUserOutput[] = [];
    
    for(let i = 0; i < 20; i++) {
      expectUsers.push({ 
        name: `john doe ${i+1}`,
        email: `johndoe${i+1}@gmail.com`
      })
    }
    
    const input = {page: 1, pageLength: 20};
    const output = await sut.execute(input);
    
    expect(output.users).toHaveLength(20)
    expect(output).toMatchObject({users: expectUsers})
  });

  test("Deve ser possivel receber os usuário da pagina 2", async () => {
    const expectUsers: ExpectedUserOutput[] = [];
    
    for(let i = 20; i < 40; i++) {
      expectUsers.push({ 
        name: `john doe ${i+1}`,
        email: `johndoe${i+1}@gmail.com`
      })
    }
    
    const input = {page: 2, pageLength: 20};
    const output = await sut.execute(input);
    
    expect(output.users).toHaveLength(20)
    expect(output).toMatchObject({users: expectUsers})
  });

  test(`Deve ser possivel receber o máximo de paginação permitido (${env.MAX_PAGE_LENGTH})`, async () => {
    const expectUsers: ExpectedUserOutput[] = [];
    
    for(let i = 0; i < env.MAX_PAGE_LENGTH; i++) {
      expectUsers.push({ 
        name: `john doe ${i+1}`,
        email: `johndoe${i+1}@gmail.com`
      })
    }
    
    const input = {page: 1};
    const output = await sut.execute(input);
    
    expect(output.users).toHaveLength(env.MAX_PAGE_LENGTH)
    expect(output).toMatchObject({users: expectUsers})
  });
});
