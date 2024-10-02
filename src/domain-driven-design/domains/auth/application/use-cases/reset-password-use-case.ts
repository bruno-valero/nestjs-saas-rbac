import { Encrypter } from '@auth-criptography/encrypter'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { TokensRepository } from '@core/respositories/tokens-repositorie'
import { Injectable } from '@nestjs/common'

interface ResetPasswordUseCaseRequest {
  password: string
  token: string
}

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  { password: string }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly tokenUserRepository: TokensRepository,
    private readonly encrypter: Encrypter,
    private readonly authUserRepository: AuthUserRepository,
  ) {}

  async execute({
    password,
    token,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const tokenExists = await this.tokenUserRepository.findById(token)

    if (!tokenExists) {
      return left(new UnauthorizedError())
    }

    console.log('new password', password)
    const newPassword = await this.encrypter.hash(password)

    const userExists = await this.authUserRepository.findById(
      tokenExists.userId,
    )

    if (!userExists) {
      return left(new ResourceNotFoundError())
    }

    userExists.password = newPassword

    await this.authUserRepository.update(userExists)

    return right({ password: newPassword })
  }
}
