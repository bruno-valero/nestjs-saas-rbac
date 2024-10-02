import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

import { DuplicatedResourceError } from '@/domain-driven-design/core/errors/errors/duplicated-resource-error'

interface UpdateOrgUseCaseRequest {
  orgSlug: string
  userId: string
  updateOptions: {
    name?: string
    // slug?: string
    url?: string
    description?: string
    domain?: string
    shouldAttachUsersByDomain?: boolean
    avatarUrl?: string
  }
}

type UpdateOrgUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | DuplicatedResourceError,
  { org: Orgs }
>

@Injectable()
export class UpdateOrgUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: UpdateOrgUseCaseRequest,
  ): Promise<UpdateOrgUseCaseResponse> {
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
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const {
      name,
      // slug,
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
    // org.slug = slug ?? org.name

    // const orgWithSameSlug = await this.orgsRepository.findBySlugAndNotSameId(
    //   org.slug.toString(),
    //   org.id.value,
    // )
    //
    // if (orgWithSameSlug) {
    //   return left(
    //     new DuplicatedResourceError(
    //       `Org with slug ${org.slug} already exists`,
    //     ),
    //   )
    // }

    const orgWithSameDomain =
      await this.orgsRepository.findByDomainAndNotSameId(
        org.domain ?? '',
        org.id.value,
      )

    if (orgWithSameDomain) {
      return left(
        new DuplicatedResourceError(
          `Org with domain ${org.domain} already exists`,
        ),
      )
    }

    await this.orgsRepository.update(org)
    return right({ org })
  }
}
