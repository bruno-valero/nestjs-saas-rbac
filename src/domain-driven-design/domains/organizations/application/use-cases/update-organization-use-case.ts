import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface UpdateOrganizationUseCaseRequest {
  orgSlug: string
  userId: string
  updateOptions: {
    name?: string
    url?: string
    description?: string
    domain?: string
    shouldAttachUsersByDomain?: boolean
    avatarUrl?: string
  }
}

type UpdateOrganizationUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { org: Orgs }
>

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: UpdateOrganizationUseCaseRequest,
  ): Promise<UpdateOrganizationUseCaseResponse> {
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

    const hasPermission = member.hasPermission('update', {
      __typeName: 'Organization',
      id: org.id.value,
      ownerId: props.userId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const {
      name,
      url,
      description,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
    } = props.updateOptions

    org.url = url ?? org.url
    org.description = description ?? org.description
    org.domain = domain ?? org.domain
    org.shouldAttachUsersByDomain =
      shouldAttachUsersByDomain ?? org.shouldAttachUsersByDomain
    org.avatarUrl = avatarUrl ?? org.avatarUrl
    org.name = name ?? org.name

    await this.orgsRepository.update(org)
    return right({ org })
  }
}
