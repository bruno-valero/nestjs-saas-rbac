import { PrismaMemberMapper } from '@database/prisma/mappers/orgs/prisma-member-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { MembersRepository } from '@orgs-repositories/members-repository'

@Injectable()
export class PrismaMembersRepository implements MembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Member | null> {
    const prismaMember = await this.prisma.member.findUnique({
      where: { id },
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

    if (!prismaMember) return null

    const mappedMember = PrismaMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async findByOrgAndUserId(
    orgId: string,
    userId: string,
  ): Promise<Member | null> {
    const prismaMember = await this.prisma.member.findUnique({
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

    if (!prismaMember) return null

    const mappedMember = PrismaMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async findManyByUserId(userId: string): Promise<Member[]> {
    const prismaMembers = await this.prisma.member.findMany({
      where: { userId },
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

    const mappedMembers = prismaMembers.map(PrismaMemberMapper.toDomain)
    return mappedMembers
  }

  async create(props: Member): Promise<Member> {
    const member = PrismaMemberMapper.domainToPrisma(props)
    const roles = props.role.map((role) => ({ role }))
    const prismaMember = await this.prisma.member.create({
      data: {
        ...member,
        roles: {
          createMany: {
            data: roles,
          },
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

    const mappedMember = PrismaMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async update(props: Member): Promise<Member> {
    const prismaMember = await this.prisma.member.update({
      where: { id: props.id.value },
      data: {
        ...PrismaMemberMapper.domainToPrisma(props),
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

    const mappedMember = PrismaMemberMapper.toDomain(prismaMember)
    return mappedMember
  }

  async delete(id: Member): Promise<void> {
    await this.prisma.member.delete({
      where: { id: id.id.value },
    })
  }
}
