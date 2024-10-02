import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { OrgInvite } from '@orgs-entities/org-invite'
import { Orgs } from '@orgs-entities/orgs'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface GetInviteDetailsUseCaseRequest {
  userId: string
  orgSlug: string
  inviteId: string
}

type GetInviteDetailsUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { invite: OrgInvite; author: Member; org: Orgs }
>

@Injectable()
export class GetInviteDetailsUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    userId,
    orgSlug,
    inviteId,
  }: GetInviteDetailsUseCaseRequest): Promise<GetInviteDetailsUseCaseResponse> {
    const org = await this.orgsRepository.findBySlug(orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const invite = await this.invitesRepository.findById(inviteId)

    if (!invite) {
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

    const author = await this.membersRepository.findById(
      invite.authorId?.value ?? '',
    )

    if (!author) {
      return left(new ResourceNotFoundError())
    }

    return right({ invite, author, org })
  }
}
