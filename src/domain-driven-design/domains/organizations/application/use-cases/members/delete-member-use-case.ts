import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface DeleteMemberUseCaseRequest {
  userId: string
  orgSlug: string
  memberId: string
}

type DeleteMemberUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { deleted: true }
>

@Injectable()
export class DeleteMemberUseCase {
  constructor(
    private readonly membersRepository: MembersRepository,
    private readonly orgsRepository: OrgsRepository,
  ) {}

  async execute(
    props: DeleteMemberUseCaseRequest,
  ): Promise<DeleteMemberUseCaseResponse> {
    const { orgSlug, userId, memberId } = props

    const org = await this.orgsRepository.findBySlug(orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      userId,
    )

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = member.hasPermission('delete', 'User')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const memberToDelete = await this.membersRepository.findById(memberId)

    if (!memberToDelete) {
      return left(new ResourceNotFoundError())
    }

    await this.membersRepository.delete(memberToDelete)

    return right({ deleted: true })
  }
}
