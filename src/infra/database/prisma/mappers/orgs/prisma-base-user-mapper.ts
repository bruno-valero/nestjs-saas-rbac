import { BaseUser } from '@orgs-entities/base-user'
import { User as PrismaBaseUser } from '@prisma/client'

export class PrismaBaseUserMapper {
  static toDomain({
    prismaBaseUser,
  }: {
    prismaBaseUser: PrismaBaseUser
  }): BaseUser {
    const baseUser = BaseUser.create(
      {
        email: prismaBaseUser.email,
        name: prismaBaseUser.name,
        password: prismaBaseUser.passwordHash ?? null,
        avatarUrl: prismaBaseUser.avatarUrl,
        createdAt: prismaBaseUser.createdAt,
        updatedAt: prismaBaseUser.updatedAt,
      },
      prismaBaseUser.id,
    )
    return baseUser
  }

  static domainToPrisma(baseUser: BaseUser): PrismaBaseUser {
    const baseUserPrisma = <PrismaBaseUser>{
      email: baseUser.email,
      name: baseUser.name,
      passwordHash: baseUser.password,
      avatarUrl: baseUser.avatarUrl,
      createdAt: baseUser.createdAt,
      updatedAt: baseUser.updatedAt,
      id: baseUser.id.value,
    }

    return baseUserPrisma
  }
}
