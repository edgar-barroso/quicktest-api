import { Class } from '@/domain/entity/Class';
import { ClassRepository } from '@/domain/repository/ClassRepository';

export class InMemoryClassRepository implements ClassRepository {
  private static instance: InMemoryClassRepository;
  items: Class[] = [];

  constructor() {}
  
  async update(classEntity: Class): Promise<Class> {
    this.items = this.items.map((item) => {
      if (item.getId() === classEntity.getId()) {
        return classEntity;
      }
      return item;
    });
    return classEntity;
  }

  static getInstance(): InMemoryClassRepository {
    if (!InMemoryClassRepository.instance) {
      InMemoryClassRepository.instance = new InMemoryClassRepository();
    }
    return InMemoryClassRepository.instance;
  }

  async delete(classEntity: Class): Promise<Class> {
    const index = this.items.findIndex(
      (item) => item.getId() === classEntity.getId(),
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return classEntity;
  }

  async create(classEntity: Class): Promise<Class> {
    this.items.push(classEntity);
    return this.items[this.items.length - 1];
  }

  async findById(id: string): Promise<Class | undefined> {
    return this.items.find((item) => item.getId() === id);
  }


}
