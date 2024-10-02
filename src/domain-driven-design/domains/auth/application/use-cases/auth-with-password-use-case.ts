import { Encoder } from '@auth-criptography/encoder'
import { Encrypter } from '@auth-criptography/encrypter'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { UserAlreadyExistsError } from '@core/errors/errors/user-already-exists-error'
import { Injectable } from '@nestjs/common'

interface AuthWithPasswordUseCaseProps {
  email: string
  password: string
}

type AuthWithPasswordUseCaseResponse = Either<
  UserAlreadyExistsError | UnauthorizedError | ResourceNotFoundError,
  {
    token: string
  }
>

@Injectable()
export class AuthWithPasswordUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly encrypter: Encrypter,
    private readonly encoder: Encoder,
  ) {}

  async execute({
    email,
    password,
  }: AuthWithPasswordUseCaseProps): Promise<AuthWithPasswordUseCaseResponse> {
    const userExists = await this.authUserRepository.findByEmail(email)

    if (!userExists) {
      return left(new ResourceNotFoundError())
    }

    if (!userExists.password) {
      return left(new UnauthorizedError())
    }

    const isValidPassword = await this.encrypter.compare(
      password,
      userExists.password,
    )

    if (!isValidPassword) {
      return left(new UnauthorizedError())
    }

    const token = await this.encoder.encode({
      sub: userExists.id.value,
    })

    return right({ token })
  }
}
