import { PrismaProjectMapper } from '@database/prisma/mappers/orgs/prisma-project-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Project } from '@orgs-entities/project'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'

@Injectable()
export class PrismaProjectsRepository implements ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { id },
    })

    if (!prismaProject) return null

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async findByIdAndOrgId(id: string, orgId: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { id, organizationId: orgId },
    })

    if (!prismaProject) return null

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async findBySlugAndOrgId(
    slug: string,
    orgId: string,
  ): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { slug, organizationId: orgId },
    })

    if (!prismaProject) return null

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async findManyByOrgId(orgId: string): Promise<Project[]> {
    const prismaProjects = await this.prisma.project.findMany({
      where: { organizationId: orgId },
    })

    const projects = prismaProjects

    const mappedProjects = projects.map((project) =>
      PrismaProjectMapper.toDomain({
        prismaProject: project,
      }),
    )

    return mappedProjects
  }

  async findManyByOwnerId(ownerId: string): Promise<Project[]> {
    const prismaProjects = await this.prisma.project.findMany({
      where: { ownerId },
    })

    const mappedProjects = prismaProjects.map((project) =>
      PrismaProjectMapper.toDomain({
        prismaProject: project,
      }),
    )

    return mappedProjects
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findUnique({
      where: { slug },
    })

    if (!prismaProject) return null

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async findBySlugAndNotSameId(
    slug: string,
    id: string,
  ): Promise<Project | null> {
    const prismaProject = await this.prisma.project.findFirst({
      where: { slug, id: { not: id } },
    })

    if (!prismaProject) return null

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async create(props: Project): Promise<Project> {
    const prismaProject = await this.prisma.project.create({
      data: PrismaProjectMapper.domainToPrisma(props),
    })

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })
    return mappedProject
  }

  async update(props: Project): Promise<Project> {
    const prismaProject = await this.prisma.project.update({
      where: { id: props.id.value },
      data: PrismaProjectMapper.domainToPrisma(props),
    })

    const project = prismaProject

    const mappedProject = PrismaProjectMapper.toDomain({
      prismaProject: project,
    })

    return mappedProject
  }

  async delete(id: Project): Promise<void> {
    await this.prisma.project.delete({
      where: { id: id.id.value },
    })
  }
}
