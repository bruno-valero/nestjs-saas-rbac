import { Either, left, right } from '@core/either'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { InvalidResourceError } from '@core/errors/errors/invalid-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { OrgInvite } from '@orgs-entities/org-invite'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
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
  | UnauthorizedError
  | ResourceNotFoundError
  | InvalidResourceError
  | DuplicatedResourceError,
  { invite: OrgInvite }
>

@Injectable()
export class CreateInviteUseCase {
  constructor(
    private readonly invitesRepository: OrgInvitesRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
  ) {}

  async execute({
    userId,
    orgSlug,
    email,
    role,
  }: CreateInviteUseCaseRequest): Promise<CreateInviteUseCaseResponse> {
    // get org
    const org = await this.orgsRepository.findBySlug(orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    // get member that is trying to invite
    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      userId,
    )

    if (!member) {
      return left(new UnauthorizedError())
    }

    // check if user has permission to invite
    const hasPermission = member.hasPermission('invite', 'User')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    // check if the user that will receive the invite is already in the organization
    const isInOrg = await this.membersRepository.findByOrgAndUserEmail(
      org.id.value,
      email,
    )

    if (isInOrg) {
      return left(
        new InvalidResourceError(
          `Email "${email}" is already attached to an organization.`,
        ),
      )
    }

    // check if the user that will receive the invite has an account
    const baseUserAccount = await this.baseUsersRepository.findByEmail(email)

    const alreadyHasAnAccount = !!baseUserAccount
    const domain = email.split('@')[1]

    // if the user that will receive the invite has an account and the organization has the option to attach users by domain, then the invite is not necessary
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

    // check if the user that will receive the invite already has an invite
    const invitesWithSameEmail =
      await this.invitesRepository.countByEmail(email)

    if (invitesWithSameEmail > 0) {
      return left(
        new DuplicatedResourceError(`Email "${email}" already has an invite.`),
      )
    }

    // create the invite
    const newInvite = OrgInvite.create({
      authorId: userId,
      organizationId: org.id.value,
      email,
      role,
    })

    // save the invite and send the email
    const invite = await this.invitesRepository.create(newInvite)

    return right({ invite })
  }
}
