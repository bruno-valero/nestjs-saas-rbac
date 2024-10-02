import { Either, left, right } from '@core/either'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface FetchOrgsUseCaseRequest {
  userId: string
}

type FetchOrgsUseCaseResponse = Either<UnauthorizedError, { orgs: Orgs[] }>

@Injectable()
export class FetchOrgsUseCase {
  constructor(
    private readonly orgRepository: OrgsRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: FetchOrgsUseCaseRequest,
  ): Promise<FetchOrgsUseCaseResponse> {
    const existingUser = await this.baseUsersRepository.findById(props.userId)

    if (!existingUser) {
      return left(new UnauthorizedError())
    }

    const participations = await this.membersRepository.findManyByUserId(
      existingUser.id.value,
    )

    const orgs = (
      await Promise.all(
        participations.map((member) =>
          this.orgRepository.findById(member.organizationId.value),
        ),
      )
    ).filter<Orgs>((org) => org !== null)

    return right({ orgs })
  }
}
