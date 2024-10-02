import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Project } from '@orgs-entities/project'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface FetchProjectsUseCaseRequest {
  userId: string
  orgSlug: string
}

type FetchProjectsUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { projects: Project[] }
>

@Injectable()
export class FetchProjectsUseCase {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: FetchProjectsUseCaseRequest,
  ): Promise<FetchProjectsUseCaseResponse> {
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

    const hasPermission = member.hasPermission('read', 'Project')

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const projects = await this.projectRepository.findManyByOwnerId(
      member.id.value,
    )

    return right({ projects })
  }
}
