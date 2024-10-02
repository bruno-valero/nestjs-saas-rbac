import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { Orgs } from '@orgs-entities/orgs'
import { Project } from '@orgs-entities/project'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface GetProjectDetailsUseCaseRequest {
  userId: string
  orgSlug: string
  projectSlug: string
}

type GetProjectDetailsUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { project: Project; owner: Member; org: Orgs }
>

@Injectable()
export class GetProjectDetailsUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: GetProjectDetailsUseCaseRequest,
  ): Promise<GetProjectDetailsUseCaseResponse> {
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

    const project = await this.projectsRepository.findBySlug(props.projectSlug)

    if (!project) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = member.hasPermission('read', {
      __typeName: 'Project',
      id: project.id.value,
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    return right({ project, owner: member, org })
  }
}
