import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface TransferOrgOwnershipUseCaseRequest {
  userId: string
  orgSlug: string
  newOwnerId: string
}

type TransferOrgOwnershipUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { org: Orgs }
>

@Injectable()
export class TransferOrgOwnershipUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
  ) {}

  async execute(
    props: TransferOrgOwnershipUseCaseRequest,
  ): Promise<TransferOrgOwnershipUseCaseResponse> {
    // *************************************
    // get org data
    const org = await this.orgsRepository.findBySlug(props.orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    // *************************************
    // get owner data
    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      props.userId,
    )

    console.log(`memberId: ${member?.id.value}`)

    if (!member) {
      return left(new UnauthorizedError())
    }

    // *************************************
    // check permission
    const hasPermission = member.hasPermission('transfer_ownership', {
      __typeName: 'Organization',
      id: org.id.value,
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    // *************************************
    // get new owner data
    const newOwner = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      props.newOwnerId,
    )

    console.log(`newOwner: ${newOwner?.id.value}`)

    if (!newOwner) {
      return left(new ResourceNotFoundError())
    }

    // *************************************
    // update new owner to ADMIN
    newOwner.switchRole(['ADMIN'])
    await this.membersRepository.update(newOwner)

    // *************************************
    // update org owner
    const newOrgData = await this.orgsRepository.transferOwnership(
      org,
      newOwner.id.value,
    )

    return right({ org: newOrgData })
  }
}
