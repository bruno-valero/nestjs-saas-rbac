import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface ShutdownOrgUseCaseRequest {
  userId: string
  orgSlug: string
}

type ShutdownOrgUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { deleted: true }
>

@Injectable()
export class ShutdownOrgUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: ShutdownOrgUseCaseRequest,
  ): Promise<ShutdownOrgUseCaseResponse> {
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

    const hasPermission = member.hasPermission('delete', {
      __typeName: 'Organization',
      id: org.id.value,
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    await this.orgsRepository.delete(org)

    return right({ deleted: true })
  }
}
