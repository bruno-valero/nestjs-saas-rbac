import { AuthOrg, AuthOrgProps } from '@auth-entities/auth-org'

export class PrismaAuthOrgMapper {
  static toDomain({
    prismaOrg,
  }: {
    prismaOrg: AuthOrgProps & { id?: string }
  }): AuthOrg {
    const org = AuthOrg.create(
      {
        ownerId: prismaOrg.ownerId,
        name: prismaOrg.name,
        url: prismaOrg.url,
        domain: prismaOrg.domain,
        shouldAttachUsersByDomain: prismaOrg.shouldAttachUsersByDomain,
      },
      prismaOrg.id,
    )
    return org
  }
}
