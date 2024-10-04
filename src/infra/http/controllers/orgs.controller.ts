import { CurrentUser } from '@auth/current-user-decorator'
import { TokenPayload } from '@auth/jwt.strategy'
import {
  CreateOrgPropsDto,
  createOrgPype,
  UpdateOrganizationPropsDto,
  updateOrganizationPype,
} from '@controllers/orgs-controller.dto'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { MemberPresenter } from '@http/presenters/orgs/member-presenter'
import { OrgsPresenter } from '@http/presenters/orgs/orgs-presenter'
import {
  Body,
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
import { CreateOrgUseCase } from '@orgs-use-cases/create-org-use-case'
import { FetchOrgsUseCase } from '@orgs-use-cases/fetch-orgs-use-case'
import { GetMembershipUseCase } from '@orgs-use-cases/get-membership-use-case'
import { GetOrgUseCase } from '@orgs-use-cases/get-org-use-case'
import { ShutdownOrgUseCase } from '@orgs-use-cases/shutdown-org-use-case'

import { UpdateOrgUseCase } from '@/domain-driven-design/domains/organizations/application/use-cases/update-org-use-case'

@ApiTags('Orgs')
@Controller('/orgs')
export class OrgsController {
  constructor(
    private readonly createOrgUseCase: CreateOrgUseCase,
    private readonly getMembershipUseCase: GetMembershipUseCase,
    private readonly getOrgUseCase: GetOrgUseCase,
    private readonly fetchOrgsUseCase: FetchOrgsUseCase,
    private readonly updateOrgUseCase: UpdateOrgUseCase,
    private readonly shutdownOrgUseCase: ShutdownOrgUseCase,
  ) {}

  @Post()
  @ApiBearerAuth('AUTH_ROUTE')
  async createOrg(
    @CurrentUser() user: TokenPayload,
    @Body(createOrgPype) body: CreateOrgPropsDto,
  ) {
    const resp = await this.createOrgUseCase.execute({
      ...body,
      ownerId: user.sub,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { org } = resp.value
      return OrgsPresenter.basic(org)
    }

    return new InternalServerErrorException()
  }

  @Get('/:orgSlug/membership')
  @ApiBearerAuth('AUTH_ROUTE')
  async getMembership(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
  ) {
    const resp = await this.getMembershipUseCase.execute({
      userId: user.sub,
      orgSlug,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { member, org } = resp.value
      return {
        org: OrgsPresenter.basic(org),
        member: MemberPresenter.basic(member),
      }
    }

    return new InternalServerErrorException()
  }

  @Get('/:orgSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async getOrg(@Param('orgSlug') orgSlug: string) {
    const resp = await this.getOrgUseCase.execute({ orgSlug })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { org } = resp.value
      return OrgsPresenter.basic(org)
    }

    return new InternalServerErrorException()
  }

  @Get()
  @ApiBearerAuth('AUTH_ROUTE')
  async fetchOrgs(@CurrentUser() user: TokenPayload) {
    const resp = await this.fetchOrgsUseCase.execute({ userId: user.sub })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }
    }

    if (resp.isRight()) {
      const { orgs } = resp.value
      return orgs.map((org) => OrgsPresenter.basic(org))
    }

    return new InternalServerErrorException()
  }

  @Patch('/:orgSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async updateOrganization(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Body(updateOrganizationPype) body: UpdateOrganizationPropsDto,
  ) {
    const resp = await this.updateOrgUseCase.execute({
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
      const { org } = resp.value
      return OrgsPresenter.basic(org)
    }

    return new InternalServerErrorException()
  }

  @Delete('/:orgSlug')
  @ApiBearerAuth('AUTH_ROUTE')
  async deleteOrg(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
  ) {
    const resp = await this.shutdownOrgUseCase.execute({
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
    }

    if (resp.isRight()) {
      const { deleted } = resp.value
      return { deleted }
    }

    return new InternalServerErrorException()
  }
}
