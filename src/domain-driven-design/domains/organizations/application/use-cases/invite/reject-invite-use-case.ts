import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface RejectInviteUseCaseRequest {
  userId: string
  inviteId: string
}

type RejectInviteUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { rejected: boolean }
>

@Injectable()
export class RejectInviteUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
  ) {}

  async execute({
    userId,
    inviteId,
  }: RejectInviteUseCaseRequest): Promise<RejectInviteUseCaseResponse> {
    const invite = await this.invitesRepository.findById(inviteId)

    if (!invite) {
      return left(new ResourceNotFoundError())
    }

    const org = await this.orgsRepository.findById(invite.organizationId.value)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const baseUser = await this.baseUsersRepository.findByEmail(userId)

    if (!baseUser) {
      return left(new ResourceNotFoundError())
    }

    if (baseUser.email !== invite.email) {
      return left(new UnauthorizedError())
    }

    await this.invitesRepository.delete(invite)

    return right({ rejected: true })
  }
}
