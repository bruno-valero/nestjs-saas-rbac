import { CurrentUser } from '@auth/current-user-decorator'
import { TokenPayload } from '@auth/jwt.strategy'
import { Public } from '@auth/public'
import {
  CreateInvitePropsDto,
  createInvitePype,
} from '@controllers/invite-controller.dto'
import { DuplicatedResourceError } from '@core/errors/errors/duplicated-resource-error'
import { InvalidResourceError } from '@core/errors/errors/invalid-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { BaseUserPresenter } from '@http/presenters/orgs/base-user-presenter'
import { InvitePresenter } from '@http/presenters/orgs/invite-presenter'
import { MemberPresenter } from '@http/presenters/orgs/member-presenter'
import { OrgsPresenter } from '@http/presenters/orgs/orgs-presenter'
import {
  BadRequestException,
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
import { AcceptInviteUseCase } from '@orgs-use-cases/invite/accept-invite-use-case'
import { CreateInviteUseCase } from '@orgs-use-cases/invite/create-invite-use-case'
import { FetchInvitesUseCase } from '@orgs-use-cases/invite/fetch-invites-use-case'
import { GetInviteDetailsUseCase } from '@orgs-use-cases/invite/get-invite-details-use-case'
import { RejectInviteUseCase } from '@orgs-use-cases/invite/reject-invite-use-case'

import { DeleteInviteUseCase } from '@/domain-driven-design/domains/organizations/application/use-cases/invite/delete-invite-use-case'

@ApiTags('Invites')
@Controller()
export class InviteController {
  constructor(
    private readonly inviteUseCase: CreateInviteUseCase,
    private readonly getInviteDetailsUseCase: GetInviteDetailsUseCase,
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
    private readonly fetchInvitesUseCase: FetchInvitesUseCase,
    private readonly rejectInviteUseCase: RejectInviteUseCase,
    private readonly deleteInviteUseCase: DeleteInviteUseCase,
  ) {}

  @Post('/orgs/:orgSlug/invites')
  @ApiBearerAuth('AUTH_ROUTE')
  async createInvite(
    @Param('orgSlug') orgSlug: string,
    @Body(createInvitePype) body: CreateInvitePropsDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.inviteUseCase.execute({
      userId: user.sub,
      orgSlug,
      email: body.email,
      role: body.role,
    })

    if (resp.isLeft()) {
      const value = resp.value
      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      if (value instanceof InvalidResourceError) {
        return new BadRequestException({ message: value.message })
      }

      if (value instanceof DuplicatedResourceError) {
        return new BadRequestException({ message: value.message })
      }

      return new InternalServerErrorException()
    }

    if (resp.isRight()) {
      const { invite } = resp.value
      return invite
    }

    return new InternalServerErrorException()
  }

  @Get('/orgs/:orgSlug/invites')
  @ApiBearerAuth('AUTH_ROUTE')
  async fetchInvites(
    @Param('orgSlug') orgSlug: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.fetchInvitesUseCase.execute({
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

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { invites } = resp.value
      return invites
    }

    return new InternalServerErrorException()
  }

  @Delete('/orgs/:orgSlug/invites/invites/:inviteId')
  @ApiBearerAuth('AUTH_ROUTE')
  async deleteInvite(
    @Param('orgSlug') orgSlug: string,
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.deleteInviteUseCase.execute({
      inviteId,
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

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { deleted } = resp.value
      return { deleted }
    }

    return new InternalServerErrorException()
  }

  @Get('/invites/:inviteId')
  @Public()
  async getInviteDetails(@Param('inviteId') inviteId: string) {
    const resp = await this.getInviteDetailsUseCase.execute({
      inviteId,
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
      const { invite, author, org } = resp.value
      return {
        invite: InvitePresenter.basic(invite),
        author: {
          userInfo: BaseUserPresenter.basic(author.userInfo),
          memberInfo: MemberPresenter.basic(author.memberInfo),
        },
        org: OrgsPresenter.basic(org),
      }
    }

    return new InternalServerErrorException()
  }

  @Patch('/invites/:inviteId/accept')
  @ApiBearerAuth('AUTH_ROUTE')
  async acceptInvite(
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.acceptInviteUseCase.execute({
      inviteId,
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
      const { member, org } = resp.value
      return {
        member: MemberPresenter.basic(member),
        org: OrgsPresenter.basic(org),
      }
    }

    return new InternalServerErrorException()
  }

  @Patch('/invites/:inviteId/reject')
  @ApiBearerAuth('AUTH_ROUTE')
  async rejectInvite(
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.rejectInviteUseCase.execute({
      inviteId,
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
      const { rejected } = resp.value
      return { rejected }
    }

    return new InternalServerErrorException()
  }
}
