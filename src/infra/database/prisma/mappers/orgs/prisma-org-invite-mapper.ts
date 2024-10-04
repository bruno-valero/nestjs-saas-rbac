import { OrgInvite } from '@orgs-entities/org-invite'
import { Invite } from '@prisma/client'

export class PrismaOrgInviteMapper {
  static toDomain({ prismaOrgInvite }: { prismaOrgInvite: Invite }): OrgInvite {
    return OrgInvite.create(
      {
        authorId: prismaOrgInvite.authorId ?? null,
        organizationId: prismaOrgInvite.organizationId,
        email: prismaOrgInvite.email,
        role: prismaOrgInvite.role,
        createdAt: prismaOrgInvite.createdAt,
      },
      prismaOrgInvite.id,
    )
  }

  static domainToPrisma(props: OrgInvite): Invite {
    return {
      id: props.id.value,
      authorId: props.authorId?.value ?? null,
      organizationId: props.organizationId.value,
      email: props.email,
      role: props.role,
      createdAt: props.createdAt,
    }
  }
}
