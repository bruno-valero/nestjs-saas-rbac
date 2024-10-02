import { Either, left, right } from '@core/either'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Project } from '@orgs-entities/project'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface UpdateProjectUseCaseRequest {
  userId: string
  orgSlug: string
  projectSlug: string
  updateOptions: Partial<{
    name: string
    url: string
    description: string
    avatarUrl: string | null
  }>
}

type UpdateProjectUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | DuplicatedResourceError,
  { project: Project }
>

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectsRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: UpdateProjectUseCaseRequest,
  ): Promise<UpdateProjectUseCaseResponse> {
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

    const hasPermissionToUpdate = member.hasPermission('update', 'Project')

    console.log(`hasPermissionToUpdate: ${hasPermissionToUpdate}`)

    if (!hasPermissionToUpdate) {
      return left(new UnauthorizedError())
    }

    const project = await this.projectRepository.findBySlugAndOrgId(
      props.projectSlug,
      org.id.value,
    )

    if (!project) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = member.hasPermission('update', {
      __typeName: 'Project',
      id: project.id.value,
      ownerId: org.ownerId,
    })

    console.log(
      `hasPermission to update project ${project.id.value}: ${hasPermission}`,
    )

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    project.name = props.updateOptions.name ?? project.name
    project.url = props.updateOptions.url ?? project.url
    project.description = props.updateOptions.description ?? project.description
    project.avatarUrl = props.updateOptions.avatarUrl ?? project.avatarUrl

    await this.projectRepository.update(project)

    return right({ project })
  }
}
