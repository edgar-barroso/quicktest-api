import { DeleteExam, DeleteExamInput } from "@/application/usecase/Exam/DeleteExam";
import { ExamRepository } from "@/domain/repository/ExamRepository";
import { UserRepository } from "@/domain/repository/UserRepository";
import { InMemoryExamRepository } from "@/infra/repository/InMemory/InMemoryExamRepository";
import { InMemoryUserRepository } from "@/infra/repository/InMemory/InMemoryUserRepository";
import { Exam } from "@/domain/entity/Exam";
import { User } from "@/domain/entity/User";
import { dummyUserProps, dummyExamProps } from "../../../utils";
import { UnauthorizedError } from "@/application/error/UnauthorizedError";
import { UserNotFoundError } from "@/application/error/UserNotFoundError";
import { QuestionNotFoundError } from "@/application/error/QuestionNotFoundError";

let sut: DeleteExam;
let examRepository: ExamRepository;
let userRepository: UserRepository;
let teacher: User;
let student: User;
let exam: Exam;

beforeEach(async () => {
  examRepository = new InMemoryExamRepository();
  userRepository = new InMemoryUserRepository();
  sut = new DeleteExam(userRepository, examRepository);

  teacher = User.create(dummyUserProps({ role: "TEACHER" }));
  student = User.create(dummyUserProps({ role: "STUDENT" }));

  exam = Exam.create(dummyExamProps({ authorId: teacher.getId() }));

  await userRepository.create(teacher);
  await userRepository.create(student);
  await examRepository.create(exam);
});

describe("DeleteExam", () => {
  test("Deve excluir um exame existente", async () => {
    const input: DeleteExamInput = {
      id: exam.getId(),
      userId: teacher.getId(),
    };

    const output = await sut.execute(input);

    expect(output).toEqual({
      id: exam.getId(),
    });

    const deletedExam = await examRepository.findById(exam.getId());
    expect(deletedExam).toBeUndefined();
  });

  test("Deve lançar erro ao tentar excluir um exame inexistente", async () => {
    const input: DeleteExamInput = {
      id: "non-existent-exam-id",
      userId: teacher.getId(),
    };

    await expect(sut.execute(input)).rejects.toThrow(QuestionNotFoundError);
  });

  test("Deve lançar erro ao tentar excluir um exame com um autor inválido", async () => {
    const input: DeleteExamInput = {
      id: exam.getId(),
      userId: student.getId(), 
    };

    await expect(sut.execute(input)).rejects.toThrow(UnauthorizedError);
  });

  test("Deve lançar erro ao tentar excluir um exame com um usuário inexistente", async () => {
    const input: DeleteExamInput = {
      id: exam.getId(),
      userId: "non-existent-user-id",
    };

    await expect(sut.execute(input)).rejects.toThrow(UserNotFoundError);
  });
});