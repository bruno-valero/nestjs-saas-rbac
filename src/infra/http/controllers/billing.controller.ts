import { CurrentUser } from '@auth/current-user-decorator'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetOrgBillingUseCase } from '@orgs-use-cases/billing/get-org-billing-use-case'

@ApiTags('Billing')
@Controller('/orgs/:orgSlug/billing')
export class BillingController {
  constructor(private readonly getOrgBillingUseCase: GetOrgBillingUseCase) {}

  @Get()
  @ApiBearerAuth('AUTH_ROUTE')
  async getBilling(
    @CurrentUser() user: string,
    @Param('orgSlug') orgSlug: string,
  ) {
    const resp = await this.getOrgBillingUseCase.execute({
      userId: user,
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
      const { billing } = resp.value
      return billing.toObject()
    }

    return new InternalServerErrorException()
  }
}
