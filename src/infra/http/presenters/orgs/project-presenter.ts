import { Project } from '@orgs-entities/project'

export class ProjectPresenter {
  static basic(project: Project) {
    return {
      id: project.id.value,
      organizationId: project.organizationId.value,
      ownerId: project.ownerId.value,
      name: project.name,
      url: project.url,
      description: project.description,
      slug: project.slug.toString(),
      avatarUrl: project.avatarUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }
  }
}
