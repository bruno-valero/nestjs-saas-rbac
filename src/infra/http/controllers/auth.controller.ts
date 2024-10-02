import { CurrentUser } from '@auth/current-user-decorator'
import { TokenPayload } from '@auth/jwt.strategy'
import { Public } from '@auth/public'
import { AuthWithPasswordUseCase } from '@auth-use-cases/auth-with-password-use-case'
import { CreateAccountUseCase } from '@auth-use-cases/create-account-use-case'
import { GetAuthProfileUseCase } from '@auth-use-cases/get-auth-profile-use-case'
import { RecoverPasswordRequestUseCase } from '@auth-use-cases/recover-password-request-use-case'
import { ResetPasswordUseCase } from '@auth-use-cases/reset-password-use-case'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@pipes/zod-validation-pipe'
import z from 'zod'

import { AuthProfilePresenter } from '@/infra/http/presenters/auth/auth-profile-presenter'
import { AuthUserPresenter } from '@/infra/http/presenters/auth/auth-user-presenter'

// -------------- signIn --------------
const signInSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
})

const signInPype = new ZodValidationPipe(signInSchema)
type SignInProps = z.infer<typeof signInSchema>

// -------------- signUp --------------
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signUpPype = new ZodValidationPipe(signUpSchema)
type SignUpProps = z.infer<typeof signUpSchema>

// -------------- recoverPassword --------------
const recoverPasswordSchema = z.object({
  email: z.string().email(),
})

const recoverPasswordPype = new ZodValidationPipe(recoverPasswordSchema)
type RecoverPasswordProps = z.infer<typeof recoverPasswordSchema>

// -------------- resetPassword --------------
const resetPasswordSchema = z.object({
  password: z.string().min(8),
  token: z.string(),
})

const resetPasswordPype = new ZodValidationPipe(resetPasswordSchema)
type ResetPasswordProps = z.infer<typeof resetPasswordSchema>

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly authWithPasswordUseCase: AuthWithPasswordUseCase,
    private readonly getAuthProfileUseCase: GetAuthProfileUseCase,
    private readonly recoverPasswordRequestUseCase: RecoverPasswordRequestUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('/sign-in')
  @Public()
  async createAccount(@Body(signInPype) body: SignInProps) {
    const resp = await this.createAccountUseCase.execute(body)

    if (resp.isLeft()) {
      const value = resp.value
      return new ConflictException({ message: value.message })
    }

    if (resp.isRight()) {
      const { authUser } = resp.value
      return AuthUserPresenter.basic(authUser)
    }

    return new InternalServerErrorException()
  }

  @Post('/sign-up')
  @Public()
  async login(@Body(signUpPype) body: SignUpProps) {
    const resp = await this.authWithPasswordUseCase.execute(body)

    if (resp.isLeft()) {
      const value = resp.value

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      return new BadRequestException({ message: value.message })
    }

    if (resp.isRight()) {
      const { token } = resp.value
      return { token }
    }

    return new InternalServerErrorException()
  }

  @Get('/profile')
  async getProfile(@CurrentUser() user: TokenPayload) {
    const resp = await this.getAuthProfileUseCase.execute({
      userId: user.sub,
    })

    if (resp.isLeft()) {
      const value = resp.value

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { authProfile } = resp.value
      return AuthProfilePresenter.basic(authProfile)
    }

    return new InternalServerErrorException()
  }

  @Post('/recover-password')
  @Public()
  async recoverPassword(@Body(recoverPasswordPype) body: RecoverPasswordProps) {
    const resp = await this.recoverPasswordRequestUseCase.execute(body)

    if (resp.isLeft()) {
      const value = resp.value

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      return new BadRequestException()
    }

    if (resp.isRight()) {
      const { token } = resp.value
      return { token: token.id.value }
    }

    return new InternalServerErrorException()
  }

  @Patch('/reset-password')
  @Public()
  async resetPassword(@Body(resetPasswordPype) body: ResetPasswordProps) {
    const resp = await this.resetPasswordUseCase.execute(body)

    if (resp.isLeft()) {
      const value = resp.value

      if (value instanceof ResourceNotFoundError) {
        return new NotFoundException({ message: value.message })
      }

      if (value instanceof UnauthorizedError) {
        return new UnauthorizedException({ message: value.message })
      }

      return new BadRequestException()
    }

    if (resp.isRight()) {
      // const { password } = resp.value
      return
    }

    return new InternalServerErrorException()
  }
}
