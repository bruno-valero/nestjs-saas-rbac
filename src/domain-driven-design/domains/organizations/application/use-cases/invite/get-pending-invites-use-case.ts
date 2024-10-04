import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { OrgInvite } from '@orgs-entities/org-invite'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface GetPendingInvitesUseCaseRequest {
  userId: string
}

type GetPendingInvitesUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { invites: OrgInvite[] }
>

@Injectable()
export class GetPendingInvitesUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
  ) {}

  async execute({
    userId,
  }: GetPendingInvitesUseCaseRequest): Promise<GetPendingInvitesUseCaseResponse> {
    const baseUser = await this.baseUsersRepository.findByEmail(userId)

    if (!baseUser) {
      return left(new ResourceNotFoundError())
    }

    const invites = await this.invitesRepository.findManyByEmail(baseUser.email)

    return right({ invites })
  }
}
