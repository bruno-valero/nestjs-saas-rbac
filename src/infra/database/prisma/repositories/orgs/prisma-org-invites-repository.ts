import { PartialBoolean, PickEntityKeys } from '@core/types/entity-utils'
import { PrismaOrgInviteMapper } from '@database/prisma/mappers/orgs/prisma-org-invite-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'
import { OrgInvite } from '@orgs-entities/org-invite'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'

@Injectable()
export class PrismaOrgInvitesRepository implements OrgInvitesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<OrgInvite | null> {
    const prismaOrgInvite = await this.prisma.invite.findUnique({
      where: { id },
    })

    if (!prismaOrgInvite) return null

    const orgInvite = prismaOrgInvite

    const mappedOrgInvite = PrismaOrgInviteMapper.toDomain({
      prismaOrgInvite: orgInvite,
    })

    return mappedOrgInvite
  }

  async findManyByOrgId(orgId: string): Promise<OrgInvite[]> {
    const prismaOrgInvites = await this.prisma.invite.findMany({
      where: { organizationId: orgId },
    })

    const orgInvites = prismaOrgInvites

    const mappedOrgInvites = orgInvites.map((orgInvite) =>
      PrismaOrgInviteMapper.toDomain({
        prismaOrgInvite: orgInvite,
      }),
    )

    return mappedOrgInvites
  }

  async findManyByOrgIdChoosingFields<
    Fields extends PartialBoolean<OrgInvite> & {
      author?: PartialBoolean<BaseUser>
    },
  >(
    orgId: string,
    { author, ...rest }: Fields,
  ): Promise<PickEntityKeys<Fields, OrgInvite & { author?: BaseUser }>[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toJSON, toObject, equals, ...invite } = rest

    const prismaOrgInvites = await this.prisma.invite.findMany({
      where: { organizationId: orgId },

      select: {
        authorId: !!invite.authorId,
        organizationId: !!invite.organizationId,
        email: !!invite.email,
        role: !!invite.role,
        id: !!invite.id,
        createdAt: !!invite.createdAt,
        author: {
          select: {
            id: !!author?.id,
            avatarUrl: !!author?.avatarUrl,
            email: !!author?.email,
            name: !!author?.name,
            createdAt: !!author?.createdAt,
            updatedAt: !!author?.updatedAt,
          },
        },
      },
    })

    return prismaOrgInvites as PickEntityKeys<
      Fields,
      OrgInvite & { author?: BaseUser }
    >[]
  }

  async findManyByEmail(email: string): Promise<OrgInvite[]> {
    const prismaOrgInvites = await this.prisma.invite.findMany({
      where: { email },
    })

    const orgInvites = prismaOrgInvites

    const mappedOrgInvites = orgInvites.map((orgInvite) =>
      PrismaOrgInviteMapper.toDomain({
        prismaOrgInvite: orgInvite,
      }),
    )
    return mappedOrgInvites
  }

  async countByEmail(email: string): Promise<number> {
    const prismaOrgInvites = await this.prisma.invite.count({
      where: { email },
    })

    return prismaOrgInvites
  }

  async create(props: OrgInvite): Promise<OrgInvite> {
    const prismaOrgInvite = await this.prisma.invite.create({
      data: PrismaOrgInviteMapper.domainToPrisma(props),
    })

    const mappedOrgInvite = PrismaOrgInviteMapper.toDomain({
      prismaOrgInvite,
    })

    return mappedOrgInvite
  }

  async update(props: OrgInvite): Promise<OrgInvite> {
    const prismaOrgInvite = await this.prisma.invite.update({
      where: { id: props.id.value },
      data: {
        ...PrismaOrgInviteMapper.domainToPrisma(props),
      },
    })

    const mappedOrgInvite = PrismaOrgInviteMapper.toDomain({
      prismaOrgInvite,
    })

    return mappedOrgInvite
  }

  async delete(props: OrgInvite): Promise<void> {
    await this.prisma.invite.delete({
      where: { id: props.id.value },
    })
  }
}
