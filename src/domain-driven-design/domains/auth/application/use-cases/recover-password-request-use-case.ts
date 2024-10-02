import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { Token } from '@core/entities/token'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { TokensRepository } from '@core/respositories/tokens-repositorie'
import { Injectable } from '@nestjs/common'

interface RecoverPasswordRequestUseCaseRequest {
  email: string
}

type RecoverPasswordRequestUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    token: Token
  }
>

@Injectable()
export class RecoverPasswordRequestUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    // private readonly encrypter: Encrypter,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async execute(
    props: RecoverPasswordRequestUseCaseRequest,
  ): Promise<RecoverPasswordRequestUseCaseResponse> {
    const userExists = await this.authUserRepository.findByEmail(props.email)

    if (!userExists) {
      return left(new ResourceNotFoundError())
    }

    const newToken = Token.create({
      type: 'PASSWORD_RECOVER',
      userId: userExists.id.value,
      createdAt: new Date(),
    })

    const token = await this.tokensRepository.create(newToken)

    // TODO: Send email with password recovery link

    console.log(`token: ${token.toJSON(2)}`)

    return right({ token })
  }
}
