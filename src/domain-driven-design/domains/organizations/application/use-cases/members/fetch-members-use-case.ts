import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface FetchMembersUseCaseRequest {
  orgSlug: string
  userId: string
}

type FetchMembersUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { members: Member[] }
>

@Injectable()
export class FetchMembersUseCase {
  constructor(
    private readonly membersRepository: MembersRepository,
    private readonly orgsRepository: OrgsRepository,
  ) {}

  async execute(
    props: FetchMembersUseCaseRequest,
  ): Promise<FetchMembersUseCaseResponse> {
    const org = await this.orgsRepository.findBySlug(props.orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      props.userId,
    )

    console.log(`memberId: ${member?.id.value}`)

    if (!member) {
      return left(new UnauthorizedError())
    }

    const hasPermission = member.hasPermission('read', {
      __typeName: 'Organization',
      id: org.id.value,
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const members = await this.membersRepository.findManyByOrgId(org.id.value)

    return right({ members })
  }
}
