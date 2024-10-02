import { PrismaBaseUserMapper } from '@database/prisma/mappers/orgs/prisma-base-user-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'

@Injectable()
export class PrismaBaseUsersRepository implements BaseUsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<BaseUser | null> {
    const prismaBaseUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!prismaBaseUser) return null

    const baseUser = prismaBaseUser

    const mappedBaseUser = PrismaBaseUserMapper.toDomain({
      prismaBaseUser: baseUser,
    })
    return mappedBaseUser
  }

  async findById(id: string): Promise<BaseUser | null> {
    const prismaBaseUser = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!prismaBaseUser) return null

    const baseUser = prismaBaseUser

    const mappedBaseUser = PrismaBaseUserMapper.toDomain({
      prismaBaseUser: baseUser,
    })
    return mappedBaseUser
  }

  async create(props: BaseUser): Promise<BaseUser> {
    const prismaBaseUser = await this.prisma.user.create({
      data: PrismaBaseUserMapper.domainToPrisma(props),
    })

    const mappedBaseUser = PrismaBaseUserMapper.toDomain({
      prismaBaseUser,
    })

    return mappedBaseUser
  }

  async update(props: BaseUser): Promise<BaseUser> {
    const prismaBaseUser = await this.prisma.user.update({
      where: { id: props.id.value },
      data: {
        ...PrismaBaseUserMapper.domainToPrisma(props),
      },
    })

    const mappedBaseUser = PrismaBaseUserMapper.toDomain({
      prismaBaseUser,
    })
    return mappedBaseUser
  }

  async delete(id: BaseUser): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.id.value },
    })
  }
}
