import { Injectable } from '@nestjs/common'
import { Project } from '@orgs-entities/project'

@Injectable()
export abstract class ProjectsRepository {
  abstract findById(id: string): Promise<Project | null>
  abstract findByIdAndOrgId(id: string, orgId: string): Promise<Project | null>
  abstract findBySlugAndOrgId(
    slug: string,
    orgId: string,
  ): Promise<Project | null>

  abstract findManyByOrgId(orgId: string): Promise<Project[]>
  abstract findManyByOwnerId(ownerId: string): Promise<Project[]>
  abstract findBySlug(slug: string): Promise<Project | null>
  abstract findBySlugAndNotSameId(
    slug: string,
    id: string,
  ): Promise<Project | null>

  abstract create(props: Project): Promise<Project>
  abstract update(props: Project): Promise<Project>
  abstract delete(id: Project): Promise<void>
}
