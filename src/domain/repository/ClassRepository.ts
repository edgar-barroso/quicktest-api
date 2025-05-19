import { Class } from "../entity/Class";

export interface ClassRepository {
  findById(id: string): Promise<Class | undefined>;
  update(item: Class): Promise<Class>;
  delete(item: Class): Promise<Class>;
  create(item: Class): Promise<Class>;
}