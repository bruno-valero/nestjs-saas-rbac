import { CurrentUser } from '@auth/current-user-decorator'
import { TokenPayload } from '@auth/jwt.strategy'
import {
  UpdateMemberPropsDto,
  updateMemberPype,
} from '@controllers/member-controller.dto'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { MemberPresenter } from '@http/presenters/orgs/member-presenter'
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
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { DeleteMemberUseCase } from '@orgs-use-cases/members/delete-member-use-case'
import { FetchMembersUseCase } from '@orgs-use-cases/members/fetch-members-use-case'
import { UpdateMemberUseCase } from '@orgs-use-cases/members/update-member-use-case'

@ApiTags('Members')
@Controller('/orgs/:orgSlug/members')
export class MemberController {
  constructor(
    private readonly fetchMembersUseCase: FetchMembersUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly deleteMemberUseCase: DeleteMemberUseCase,
  ) {}

  @Get()
  @ApiBearerAuth('AUTH_ROUTE')
  async fetchMembers(
    @Param('orgSlug') orgSlug: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const resp = await this.fetchMembersUseCase.execute({
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
      const { members } = resp.value
      return members.map((member) => MemberPresenter.basic(member))
    }

    return new InternalServerErrorException()
  }

  @Patch('/:memberId')
  @ApiBearerAuth('AUTH_ROUTE')
  async updateMember(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Param('memberId') memberId: string,
    @Body(updateMemberPype) body: UpdateMemberPropsDto,
  ) {
    const resp = await this.updateMemberUseCase.execute({
      userId: user.sub,
      orgSlug,
      memberId,
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

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { member } = resp.value
      return MemberPresenter.basic(member)
    }

    return new InternalServerErrorException()
  }

  @Delete('/:memberId')
  @ApiBearerAuth('AUTH_ROUTE')
  async deleteMember(
    @CurrentUser() user: TokenPayload,
    @Param('orgSlug') orgSlug: string,
    @Param('memberId') memberId: string,
  ) {
    const resp = await this.deleteMemberUseCase.execute({
      userId: user.sub,
      orgSlug,
      memberId,
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
}
