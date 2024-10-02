import { Project } from '@orgs-entities/project'
import { Project as PrismaProject } from '@prisma/client'

export class PrismaProjectMapper {
  static toDomain({
    prismaProject,
  }: {
    prismaProject: PrismaProject
  }): Project {
    const project = Project.create(
      {
        organizationId: prismaProject.organizationId,
        ownerId: prismaProject.ownerId,
        name: prismaProject.name,
        url: prismaProject.url,
        description: prismaProject.description,
        slug: prismaProject.slug,
        avatarUrl: prismaProject.avatarUrl,
        createdAt: prismaProject.createdAt,
        updatedAt: prismaProject.updatedAt,
      },
      prismaProject.id,
    )

    return project
  }

  static domainToPrisma(props: Project): PrismaProject {
    return {
      id: props.id.value,
      organizationId: props.organizationId.value,
      ownerId: props.ownerId.value,
      name: props.name,
      url: props.url,
      description: props.description,
      slug: props.slug.toString(),
      avatarUrl: props.avatarUrl,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
  }
}
