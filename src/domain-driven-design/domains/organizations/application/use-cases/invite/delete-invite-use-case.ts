import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface DeleteInviteUseCaseRequest {
  inviteId: string
  userId: string
  orgSlug: string
}

type DeleteInviteUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { deleted: boolean }
>

@Injectable()
export class DeleteInviteUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    inviteId,
    orgSlug,
    userId,
  }: DeleteInviteUseCaseRequest): Promise<DeleteInviteUseCaseResponse> {
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

    const hasPermission = member.hasPermission('delete', 'Invite')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const invite = await this.invitesRepository.findById(inviteId)

    if (!invite) {
      return left(new ResourceNotFoundError())
    }

    await this.invitesRepository.delete(invite)

    return right({ deleted: true })
  }
}
