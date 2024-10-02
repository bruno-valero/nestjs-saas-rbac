import { Encrypter } from '@auth-criptography/encrypter'
import { AuthMember } from '@auth-entities/auth-member'
import { AuthUser } from '@auth-entities/auth-user'
import { AuthMemberRepository } from '@auth-repositories/auth-member-repository'
import { AuthOrgsRepository } from '@auth-repositories/auth-orgs-repository'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { UnauthorizedError } from '@core/errors/errors/unauthorized-error'
import { UserAlreadyExistsError } from '@core/errors/errors/user-already-exists-error'
import { Injectable } from '@nestjs/common'

export interface CreateAccountUseCaseProps {
  name: string
  email: string
  password?: string
}

export type CreateAccountUseCaseResponse = Either<
  UserAlreadyExistsError | UnauthorizedError,
  {
    authUser: AuthUser
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly authuserRepository: AuthUserRepository,
    private readonly authOrgRepository: AuthOrgsRepository,
    private readonly authMemberRepository: AuthMemberRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async execute(
    props: CreateAccountUseCaseProps,
  ): Promise<CreateAccountUseCaseResponse> {
    const alreadyExists = await this.authuserRepository.findByEmail(props.email)

    if (alreadyExists) {
      return left(new UserAlreadyExistsError(props.email))
    }

    if (!props.password) {
      return left(new UnauthorizedError())
    }

    const passwordHash = await this.encrypter.hash(props.password)

    const newAuthUser = AuthUser.create({
      email: props.email,
      password: passwordHash,
      name: props.name,
    })

    const authUser = await this.authuserRepository.create(newAuthUser)

    const domain = props.email.split('@')[1]

    const org = await this.authOrgRepository.findByDomain(domain, {
      shouldAttachUsersByDomain: true,
    })
    console.log(`org: ${org?.toJSON(2)}`)
    if (org) {
      const newMember = AuthMember.create({
        userId: authUser.id.value,
        organizationId: org.id.value,
        role: ['MEMBER'],
      })
      await this.authMemberRepository.create(newMember)
    }

    return right({ authUser })
  }
}
