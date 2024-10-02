import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { OrgInvite } from '@orgs-entities/org-invite'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface RejectInviteUseCaseRequest {
  userId: string
  orgSlug: string
  inviteId: string
}

type RejectInviteUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { invite: OrgInvite }
>

@Injectable()
export class RejectInviteUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    userId,
    orgSlug,
    inviteId,
  }: RejectInviteUseCaseRequest): Promise<RejectInviteUseCaseResponse> {
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

    const hasPermission = member.hasPermission('update', 'Invite')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const invite = await this.invitesRepository.findById(inviteId)

    if (!invite) {
      return left(new ResourceNotFoundError())
    }

    return right({ invite })
  }
}
