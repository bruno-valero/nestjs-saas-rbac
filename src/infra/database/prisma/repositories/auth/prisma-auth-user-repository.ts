import { AuthUser } from '@auth-entities/auth-user'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { PrismaAuthUserMapper } from '@database/prisma/mappers/auth/prisma-auth-user-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAuthUserRepository implements AuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!prismaUser) return null

    const user = prismaUser

    const mappedUser = PrismaAuthUserMapper.toDomain({
      prismaUser: user,
    })

    return mappedUser
  }

  async findById(id: string): Promise<AuthUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!prismaUser) return null

    const user = prismaUser

    const mappedUser = PrismaAuthUserMapper.toDomain({
      prismaUser: user,
    })

    return mappedUser
  }

  async create(props: AuthUser): Promise<AuthUser> {
    const prismaUser = await this.prisma.user.create({
      data: PrismaAuthUserMapper.domainToPrisma(props),
    })

    const mappedUser = PrismaAuthUserMapper.toDomain({
      prismaUser,
    })

    return mappedUser
  }

  async update(props: AuthUser): Promise<AuthUser> {
    const prismaUser = await this.prisma.user.update({
      where: { id: props.id.value },
      data: {
        ...PrismaAuthUserMapper.domainToPrisma(props),
      },
    })

    const mappedUser = PrismaAuthUserMapper.toDomain({
      prismaUser,
    })

    return mappedUser
  }

  async delete(id: AuthUser): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.id.value },
    })
  }
}
