import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { Orgs } from '@orgs-entities/orgs'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface GetMembershipUseCaseRequest {
  userId: string
  orgSlug: string
}

type GetMembershipUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    member: Member
    org: Orgs
  }
>

@Injectable()
export class GetMembershipUseCase {
  constructor(
    private readonly memberRepository: MembersRepository,
    private readonly orgRepository: OrgsRepository,
  ) {}

  async execute(
    props: GetMembershipUseCaseRequest,
  ): Promise<GetMembershipUseCaseResponse> {
    const existingOrg = await this.orgRepository.findBySlug(props.orgSlug)

    if (!existingOrg) {
      return left(new ResourceNotFoundError())
    }
    const existingMember = await this.memberRepository.findByOrgAndUserId(
      existingOrg.id.value,
      props.userId,
    )

    if (!existingMember) {
      return left(new UnauthorizedError())
    }

    return right({ member: existingMember, org: existingOrg })
  }
}
