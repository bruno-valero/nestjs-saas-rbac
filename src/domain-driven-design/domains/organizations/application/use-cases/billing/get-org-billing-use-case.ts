import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { OrgBilling } from '@orgs-entities/org-billing'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface GetOrgBillingUseCaseRequest {
  orgSlug: string
  userId: string
}

type GetOrgBillingUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { billing: OrgBilling }
>

@Injectable()
export class GetOrgBillingUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly orgsRepository: OrgsRepository,
  ) {}

  async execute(
    props: GetOrgBillingUseCaseRequest,
  ): Promise<GetOrgBillingUseCaseResponse> {
    const org = await this.orgsRepository.findBySlug(props.orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    const member = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      props.userId,
    )

    if (!member) {
      return left(new UnauthorizedError())
    }

    const hasPermission = member.hasPermission('read', 'Billing')

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const seatsAmount = await this.membersRepository.countByOrgIdExcludingRoles(
      org.id.value,
      ['BILLING'],
    )

    const projectsAmount = await this.projectsRepository.countByOrgId(
      org.id.value,
    )

    const billing = OrgBilling.create({
      projectsAmount,
      seatsAmount,
    })

    return right({ billing })
  }
}
