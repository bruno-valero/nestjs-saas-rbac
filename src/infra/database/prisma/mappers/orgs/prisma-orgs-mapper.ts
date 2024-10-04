import { Orgs } from '@orgs-entities/orgs'
import { Organization as PrismaOrgs } from '@prisma/client'

export class PrismaOrgsMapper {
  static toDomain({ prismaOrgs }: { prismaOrgs: PrismaOrgs }): Orgs {
    const orgs = Orgs.create(
      {
        ownerId: prismaOrgs.ownerId,
        name: prismaOrgs.name,
        url: prismaOrgs.url,
        domain: prismaOrgs.domain ?? undefined,
        shouldAttachUsersByDomain: prismaOrgs.shouldAttachUsersByDomain,
        avatarUrl: prismaOrgs.avatarUrl,
        createdAt: prismaOrgs.createdAt,
        updatedAt: prismaOrgs.updatedAt,
        slug: prismaOrgs.slug,
        description: prismaOrgs.description,
      },
      prismaOrgs.id,
    )
    return orgs
  }

  static domainToPrisma(orgs: Orgs): PrismaOrgs {
    const { ownerId, name, url, domain, shouldAttachUsersByDomain } =
      orgs.toObject()
    const prismaOrgs = <PrismaOrgs>{
      ownerId,
      name,
      url,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl: orgs.avatarUrl,
      createdAt: orgs.createdAt,
      updatedAt: orgs.updatedAt,
      slug: orgs.slug.toString(),
      description: orgs.description,
      id: orgs.id.value,
    }
    return prismaOrgs
  }
}
