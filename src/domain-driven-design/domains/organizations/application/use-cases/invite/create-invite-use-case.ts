import { Either, left, right } from '@core/either'
import { InvalidResourceError } from '@core/errors/errors/invalid-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { OrgInvite } from '@orgs-entities/org-invite'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { Role } from '@permissions/permissions'

interface CreateInviteUseCaseRequest {
  userId: string
  orgSlug: string
  email: string
  role: Role
}

type CreateInviteUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | InvalidResourceError,
  { invite: OrgInvite }
>

@Injectable()
export class CreateInviteUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    userId,
    orgSlug,
    email,
    role,
  }: CreateInviteUseCaseRequest): Promise<CreateInviteUseCaseResponse> {
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

    const hasPermission = member.hasPermission('invite', 'User')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const existingMembers =
      await this.membersRepository.findManyByUserEmail(email)

    const isInOrg = existingMembers.some(
      (member) => member.organizationId.value === org.id.value,
    )

    if (isInOrg) {
      return left(
        new InvalidResourceError(
          `Email "${email}" is already attached to an organization.`,
        ),
      )
    }

    const alreadyHasAnAccount = existingMembers.length > 0
    const domain = email.split('@')[1]

    if (
      !alreadyHasAnAccount &&
      org.shouldAttachUsersByDomain &&
      domain === org.domain
    ) {
      return left(
        new InvalidResourceError(
          `Email "${email}" will automatically attach to the organization. An invite is not necessary`,
        ),
      )
    }

    const newInvite = OrgInvite.create({
      authorId: userId,
      organizationId: org.id.value,
      email,
      role,
    })

    const invite = await this.invitesRepository.create(newInvite)

    return right({ invite })
  }
}
