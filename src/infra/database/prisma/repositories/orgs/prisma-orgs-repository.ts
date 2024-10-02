import { PrismaOrgsMapper } from '@database/prisma/mappers/orgs/prisma-orgs-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'

import { OrgsRepository } from '@/domain-driven-design/domains/organizations/application/repositories/orgs-repository'

@Injectable()
export class PrismaOrgsRepository implements OrgsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Orgs | null> {
    const prismaOrgs = await this.prisma.organization.findUnique({
      where: { id },
    })

    if (!prismaOrgs) return null

    const orgs = prismaOrgs

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs: orgs,
    })

    return mappedOrgs
  }

  async findByDomain(domain: string): Promise<Orgs | null> {
    const prismaOrgs = await this.prisma.organization.findUnique({
      where: { domain },
    })

    if (!prismaOrgs) return null

    const orgs = prismaOrgs

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs: orgs,
    })

    return mappedOrgs
  }

  async findBySlug(slug: string): Promise<Orgs | null> {
    const prismaOrgs = await this.prisma.organization.findUnique({
      where: { slug },
    })

    if (!prismaOrgs) return null

    const orgs = prismaOrgs

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs: orgs,
    })

    return mappedOrgs
  }

  async findBySlugAndNotSameId(slug: string, id: string): Promise<Orgs | null> {
    const prismaOrgs = await this.prisma.organization.findFirst({
      where: { slug, id: { not: id } },
    })

    if (!prismaOrgs) return null

    const orgs = prismaOrgs

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs: orgs,
    })

    return mappedOrgs
  }

  async findByDomainAndNotSameId(
    domain: string,
    id: string,
  ): Promise<Orgs | null> {
    const prismaOrgs = await this.prisma.organization.findFirst({
      where: { domain, id: { not: id } },
    })

    if (!prismaOrgs) return null

    const orgs = prismaOrgs

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs: orgs,
    })

    return mappedOrgs
  }

  async transferOwnership(org: Orgs, newOwnerId: string): Promise<Orgs> {
    const prismaOrgs = await this.prisma.organization.update({
      where: { id: org.id.value },
      data: {
        ownerId: newOwnerId,
      },
    })

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs,
    })

    return mappedOrgs
  }

  async findManyByUserId(userId: string): Promise<Orgs[]> {
    const prismaOrgs = await this.prisma.organization.findMany({
      where: { ownerId: userId },
    })

    const orgs = prismaOrgs

    const mappedOrgs = orgs.map((org) =>
      PrismaOrgsMapper.toDomain({
        prismaOrgs: org,
      }),
    )
    return mappedOrgs
  }

  async create(props: Orgs): Promise<Orgs> {
    const prismaOrgs = await this.prisma.organization.create({
      data: PrismaOrgsMapper.domainToPrisma(props),
    })

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs,
    })

    return mappedOrgs
  }

  async update(props: Orgs): Promise<Orgs> {
    const prismaOrgs = await this.prisma.organization.update({
      where: { id: props.id.value },
      data: {
        ...PrismaOrgsMapper.domainToPrisma(props),
      },
    })

    const mappedOrgs = PrismaOrgsMapper.toDomain({
      prismaOrgs,
    })

    return mappedOrgs
  }

  async delete(id: Orgs): Promise<void> {
    await this.prisma.organization.delete({
      where: { id: id.id.value },
    })
  }
}
