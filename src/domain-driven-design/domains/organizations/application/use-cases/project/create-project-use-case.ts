import { Either, left, right } from '@core/either'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { Project } from '@orgs-entities/project'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

interface CreateProjectUseCaseRequest {
  orgSlug: string
  ownerId: string
  name: string
  url: string
  description: string
  slug?: string
  avatarUrl?: string | null
}

type CreateProjectUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | DuplicatedResourceError,
  { project: Project }
>

@Injectable()
export class CreateProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly orgsRepository: OrgsRepository,
    private readonly membersRepository: MembersRepository,
  ) {}

  async execute(
    props: CreateProjectUseCaseRequest,
  ): Promise<CreateProjectUseCaseResponse> {
    const { orgSlug, ownerId, name, url, description, slug, avatarUrl } = props

    // check if org exists
    const org = await this.orgsRepository.findBySlug(orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }

    // check if owner exists
    const projectOwner = await this.membersRepository.findByOrgAndUserId(
      org.id.value,
      ownerId,
    )

    if (!projectOwner) {
      return left(new ResourceNotFoundError())
    }

    const hasPermission = projectOwner.hasPermission('create', 'Project')

    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      return left(new UnauthorizedError())
    }

    const newProject = Project.create({
      organizationId: org.id.value,
      ownerId: projectOwner.id.value,
      name,
      url,
      description,
      slug,
      avatarUrl,
    })

    // check if slug exists
    const sameSlugProject = await this.projectsRepository.findBySlug(
      newProject.slug.toString(),
    )

    if (sameSlugProject) {
      return left(
        new DuplicatedResourceError(
          `Project with slug ${newProject.slug.toString()} already exists`,
        ),
      )
    }

    // create project
    const project = await this.projectsRepository.create(newProject)

    return right({ project })
  }
}
