import { User } from "@/domain/entity/User";
import { Role, User as UserPrisma } from "@prisma/client";

export class PrismaUserMapper {
  static toPrisma(user: User):UserPrisma {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      passwordHash: user.getPassword().getValue(),
      role: user.getRole() as Role,
      createdAt: user.getCreatedAt(),
    };
  }

  static toDomain(user: UserPrisma): User {
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      isPasswordHash: true,
      role: user.role,
      createdAt: user.createdAt,
    })
  }
}