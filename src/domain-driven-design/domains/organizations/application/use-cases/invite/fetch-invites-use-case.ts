import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { PickEntityKeys } from '@core/types/entity-utils'
import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'
import { OrgInvite } from '@orgs-entities/org-invite'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface FetchInvitesUseCaseRequest {
  userId: string
  orgSlug: string
}

type Fields = {
  id: true
  email: true
  role: true
  authorId: true
  createdAt: true
  author: {
    id: true
    name: true
  }
}

type FetchInvitesUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { invites: PickEntityKeys<Fields, OrgInvite & { author?: BaseUser }>[] }
>

@Injectable()
export class FetchInvitesUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    userId,
    orgSlug,
  }: FetchInvitesUseCaseRequest): Promise<FetchInvitesUseCaseResponse> {
    const org = await this.orgsRepository.findBySlug(orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      userId,
    )

    if (!member) {
      return left(new UnauthorizedError())
    }

    const hasPermission = member.hasPermission('read', 'Invite')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    // const invites = await this.invitesRepository.findManyByOrgId(org.id.value)
    const invites = await this.invitesRepository.findManyByOrgIdChoosingFields(
      org.id.value,
      <Fields>{
        id: true,
        email: true,
        role: true,
        authorId: true,
        createdAt: true,
        author: {
          id: true,
          name: true,
        },
      },
    )

    return right({ invites })
  }
}
