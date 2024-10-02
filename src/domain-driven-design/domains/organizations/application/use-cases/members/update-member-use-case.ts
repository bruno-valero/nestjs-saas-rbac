import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { RoleItem } from '@orgs-entities/role-item'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { RoleItemRepository } from '@orgs-repositories/role-item-repository'
import { Role } from '@permissions/permissions'

interface UpdateMemberUseCaseRequest {
  userId: string
  orgSlug: string
  memberId: string
  updateOptions: {
    role: Role[]
  }
}

type UpdateMemberUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { member: Member }
>

@Injectable()
export class UpdateMemberUseCase {
  constructor(
    private readonly membersRepository: MembersRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly roleItemRepository: RoleItemRepository,
  ) {}

  async execute(
    props: UpdateMemberUseCaseRequest,
  ): Promise<UpdateMemberUseCaseResponse> {
    const org = await this.orgsRepository.findBySlug(props.orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      props.userId,
    )

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = member.hasPermission('update', 'User')

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const memberToUpdate = await this.membersRepository.findById(props.memberId)

    if (!memberToUpdate) {
      return left(new ResourceNotFoundError())
    }

    const { addedRoles, removedRoles } = memberToUpdate.switchRole(
      props.updateOptions.role,
    )
    // console.log(`addedRoles: ${addedRoles}`)
    // console.log(`removedRoles: ${removedRoles}`)

    const rolesToRemove = removedRoles.map((role) =>
      RoleItem.create({
        memberId: memberToUpdate.id.value,
        role,
      }),
    )

    const rolesToAdd = addedRoles.map((role) =>
      RoleItem.create({
        memberId: memberToUpdate.id.value,
        role,
      }),
    )

    await this.roleItemRepository.deleteMany(rolesToRemove)
    await this.roleItemRepository.createMany(rolesToAdd)

    const updatedMember = await this.membersRepository.findById(
      memberToUpdate.id.value,
    )

    if (!updatedMember) {
      return left(new ResourceNotFoundError())
    }

    return right({ member: updatedMember })
  }
}
