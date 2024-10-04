import { CurrentUser } from '@auth/current-user-decorator'
import { TokenPayload } from '@auth/jwt.strategy'
import {
  CreateProjectPropsDto,
  createProjectPype,
  UpdateProjectPropsDto,
  updateProjectPype,
} from '@controllers/project-controller.dto'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { MemberPresenter } from '@http/presenters/orgs/member-presenter'
import { OrgsPresenter } from '@http/presenters/orgs/orgs-presenter'
import { ProjectPresenter } from '@http/presenters/orgs/project-presenter'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateProjectUseCase } from '@orgs-use-cases/project/create-project-use-case'
import { DeleteProjectUseCase } from '@orgs-use-cases/project/delete-project-use-case'
import { FetchProjectsUseCase } from '@orgs-use-cases/project/fetch-projects-use-case'
import { GetProjectDetailsUseCase } from '@orgs-use-cases/project/get-project-details-use-case'
import { UpdateProjectUseCase } from '@orgs-use-cases/project/update-project-use-case'

@ApiTags('Projects')
@Controller('/orgs/:orgSlug/projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getProjectDetailsUseCase: GetProjectDetailsUseCase,
    private readonly fetchProjectsUseCase: FetchProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
  ) {}

  @Post()
  @ApiBearerAuth('AUTH_ROUTE')
  async createProject(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Body(createProjectPype) body: CreateProjectPropsDto,
  ) {
    const resp = await this.createProjectUseCase.execute({
      ...body,
      ownerId: user.sub,
      orgSlug,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }
      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
      if (value instanceof DuplicatedResourceError) {
        return new ConflictException({ message: value.message })
      }

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { project } = resp.value

      return { project: ProjectPresenter.basic(project) }
    }

    return new InternalServerErrorException()
  }

  @Delete('/:projectSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async deleteProject(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Param('projectSlug') projectSlug: string,
  ) {
    const resp = await this.deleteProjectUseCase.execute({
      projectSlug,
      orgSlug,
      userId: user.sub,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { deleted } = resp.value
      return { deleted }
    }

    return new InternalServerErrorException()
  }

  @Get('/:projectSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async getProject(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Param('projectSlug') projectSlug: string,
  ) {
    const resp = await this.getProjectDetailsUseCase.execute({
      userId: user.sub,
      orgSlug,
      projectSlug,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { project, owner, org } = resp.value
      return {
        project: {
          ...ProjectPresenter.basic(project),
          owner: MemberPresenter.basic(owner),
          org: OrgsPresenter.basic(org),
        },
      }
    }

    return new InternalServerErrorException()
  }

  @Get()
  @ApiBearerAuth('AUTH_ROUTE')
  async fetchProjects(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
  ) {
    const resp = await this.fetchProjectsUseCase.execute({
      userId: user.sub,
      orgSlug,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { projects } = resp.value
      return {
        projects: projects.map((project) => ProjectPresenter.basic(project)),
      }
    }

    return new InternalServerErrorException()
  }

  @Patch('/:projectSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async updateProject(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Param('projectSlug') projectSlug: string,
    @Body(updateProjectPype) body: UpdateProjectPropsDto,
  ) {
    const resp = await this.updateProjectUseCase.execute({
      projectSlug,
      orgSlug,
      userId: user.sub,
      updateOptions: body,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { project } = resp.value
      return { project: ProjectPresenter.basic(project) }
    }

    return new InternalServerErrorException()
  }
}
