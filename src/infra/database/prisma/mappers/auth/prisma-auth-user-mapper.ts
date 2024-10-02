import { AuthUser } from '@auth-entities/auth-user'
import { User as PrismaUser } from '@prisma/client'

export class PrismaAuthUserMapper {
  static toDomain({ prismaUser }: { prismaUser: PrismaUser }): AuthUser {
    const user = AuthUser.create(
      {
        email: prismaUser.email,
        name: prismaUser.name ?? undefined,
        password: prismaUser.passwordHash ?? undefined,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      },
      prismaUser.id,
    )
    return user
  }

  static domainToPrisma(authUser: AuthUser): PrismaUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, ...rest } = authUser.toObject()
    const user = <PrismaUser>{
      ...rest,
      passwordHash: password,
    }
    return user
  }
}
