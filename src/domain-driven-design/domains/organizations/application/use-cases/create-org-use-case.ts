import { Either, left, right } from '@core/either'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { Orgs } from '@orgs-entities/orgs'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface CreateOrgUseCaseRequest {
  name: string
  url: string
  description: string
  slug?: string
  domain?: string
  shouldAttachUsersByDomain: boolean
  avatarUrl: string | null
  ownerId: string
}

type CreateOrgUseCaseResponse = Either<
  ResourceNotFoundError | DuplicatedResourceError,
  {
    org: Orgs
  }
>

@Injectable()
export class CreateOrgUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly baseUsersRepository: BaseUsersRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute({
    ...props
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const existingUser = await this.baseUsersRepository.findById(props.ownerId)

    if (!existingUser) {
      return left(new ResourceNotFoundError())
    }

    const org = Orgs.create(props)

    let duplicatedDomain: Orgs | null = null
    let duplicatedSlug: Orgs | null = null

    if (org.domain) {
      duplicatedDomain = await this.orgsRepository.findByDomain(org.domain)
    }
    duplicatedSlug = await this.orgsRepository.findBySlug(org.slug.toString())

    if (!!duplicatedDomain || !!duplicatedSlug) {
      return left(
        new DuplicatedResourceError(
          `Duplicated ${duplicatedDomain?.id.value ? 'domain' : 'slug'}: ${duplicatedDomain?.id.value ? duplicatedDomain?.id.value : duplicatedSlug?.slug.toString()} already exists.`,
        ),
      )
    }

    const orgs = await this.orgsRepository.create(org)

    const newMember = Member.create({
      userId: props.ownerId,
      organizationId: orgs.id.value,
      role: ['ADMIN'],
    })

    await this.membersRepository.create(newMember)

    return right({ org: orgs })
  }
}
