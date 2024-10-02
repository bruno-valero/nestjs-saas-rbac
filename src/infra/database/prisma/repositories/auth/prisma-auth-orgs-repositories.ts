import { AuthOrg, AuthOrgProps } from '@auth-entities/auth-org'
import { AuthOrgsRepository } from '@auth-repositories/auth-orgs-repository'
import { PrismaAuthOrgMapper } from '@database/prisma/mappers/auth/prisma-auth-org-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAuthOrgsRepository implements AuthOrgsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDomain(
    domain: string,
    and?: Partial<AuthOrgProps>,
  ): Promise<AuthOrg | null> {
    const prismaOrg = await this.prisma.organization.findUnique({
      where: { domain, ...and },
      select: {
        id: true,
        ownerId: true,
        name: true,
        url: true,
        domain: true,
        shouldAttachUsersByDomain: true,
      },
    })

    if (!prismaOrg) return null

    const org = prismaOrg

    const mappedOrg = PrismaAuthOrgMapper.toDomain({
      prismaOrg: org,
    })

    return mappedOrg
  }

  async findById(id: string): Promise<AuthOrg | null> {
    const prismaOrg = await this.prisma.organization.findUnique({
      where: { id },
    })

    if (!prismaOrg) return null

    const org = prismaOrg

    const mappedOrg = PrismaAuthOrgMapper.toDomain({
      prismaOrg: org,
    })

    return mappedOrg
  }

  async findManyByUserId(userId: string): Promise<AuthOrg[]> {
    const prismaOrgs = await this.prisma.organization.findMany({
      where: { ownerId: userId },
    })

    const orgs = prismaOrgs

    const mappedOrgs = orgs.map((org) =>
      PrismaAuthOrgMapper.toDomain({
        prismaOrg: org,
      }),
    )

    return mappedOrgs
  }
}
