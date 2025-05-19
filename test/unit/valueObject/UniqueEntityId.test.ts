import { UniqueEntityId } from "@/domain/valueObject/UniqueEntityId";

test("Deve criar uma instancia de id nova", () => {
  expect(new UniqueEntityId()).toBeTruthy();
});

test("Deve criar uma instancia de id com valor existente", () => {
  const id = new UniqueEntityId("27988167-9273-4b63-88f1-b65e8956102a");
  expect(id.getValue()).toBe("27988167-9273-4b63-88f1-b65e8956102a");
});
