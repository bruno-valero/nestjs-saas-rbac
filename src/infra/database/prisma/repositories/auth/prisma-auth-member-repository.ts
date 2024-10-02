import { AuthMember } from '@auth-entities/auth-member'
import { AuthMemberRepository } from '@auth-repositories/auth-member-repository'
import { PrismaAuthMemberMapper } from '@database/prisma/mappers/auth/prisma-auth-member-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAuthMemberRepository implements AuthMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AuthMember | null> {
    const authMember = await this.prisma.member.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    })

    if (!authMember) return null

    const mappedMember = PrismaAuthMemberMapper.toDomain(authMember)
    return mappedMember
  }

  async findByOrgAndUserId(
    orgId: string,
    userId: string,
  ): Promise<AuthMember | null> {
    const authMember = await this.prisma.member.findUnique({
      where: {
        userId_organizationId: {
          organizationId: orgId,
          userId,
        },
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    })

    if (!authMember) return null

    const mappedMember = PrismaAuthMemberMapper.toDomain(authMember)
    return mappedMember
  }

  async findManyByUserId(userId: string): Promise<AuthMember[]> {
    const authMember = await this.prisma.member.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    })

    const mappedMember = authMember.map(PrismaAuthMemberMapper.toDomain)
    return mappedMember
  }

  async create(props: AuthMember): Promise<AuthMember> {
    const data = PrismaAuthMemberMapper.domainToPrisma(props)
    const roles = props.role.map((role) => ({ role }))
    const prismaMember = await this.prisma.member.create({
      data: { ...data, roles: { createMany: { data: roles } } },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    })

    const mappedMember = PrismaAuthMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async update(props: AuthMember): Promise<AuthMember> {
    const prismaMember = await this.prisma.member.update({
      where: { id: props.id.value },
      data: {
        ...PrismaAuthMemberMapper.domainToPrisma(props),
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
    })

    const mappedMember = PrismaAuthMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async delete(id: AuthMember): Promise<void> {
    await this.prisma.member.delete({
      where: { id: id.id.value },
    })
  }
}
