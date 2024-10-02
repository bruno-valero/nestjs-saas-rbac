import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface DeleteProjectUseCaseRequest {
  userId: string
  orgSlug: string
  projectSlug: string
}

type DeleteProjectUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  { deleted: true }
>

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async execute(
    props: DeleteProjectUseCaseRequest,
  ): Promise<DeleteProjectUseCaseResponse> {
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

    const project = await this.projectsRepository.findBySlugAndOrgId(
      props.projectSlug,
      org.id.value,
    )

    if (!project) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = member.hasPermission('delete', {
      __typeName: 'Project',
      id: project.id.value,
      ownerId: org.ownerId,
    })

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    await this.projectsRepository.delete(project)

    return right({ deleted: true })
  }
}
