import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'
import { Member } from '@orgs-entities/member'
import { OrgInvite } from '@orgs-entities/org-invite'
import { Orgs } from '@orgs-entities/orgs'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface GetInviteDetailsUseCaseRequest {
  inviteId: string
}

type GetInviteDetailsUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  {
    invite: OrgInvite
    author: {
      userInfo: BaseUser
      memberInfo: Member
    }
    org: Orgs
  }
>

@Injectable()
export class GetInviteDetailsUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
  ) {}

  async execute({
    inviteId,
  }: GetInviteDetailsUseCaseRequest): Promise<GetInviteDetailsUseCaseResponse> {
    const invite = await this.invitesRepository.findById(inviteId)

    if (!invite) {
      return left(new ResourceNotFoundError())
    }

    const org = await this.orgsRepository.findById(invite.organizationId.value)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const authorBaseUser = await this.baseUsersRepository.findById(
      invite.authorId?.value ?? '',
    )

    if (!authorBaseUser) {
      return left(new ResourceNotFoundError())
    }

    const authorMember = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      authorBaseUser.id.value,
    )

    if (!authorMember) {
      return left(new UnauthorizedError())
    }

    const author = {
      userInfo: authorBaseUser,
      memberInfo: authorMember,
    }

    return right({ invite, author, org })
  }
}
