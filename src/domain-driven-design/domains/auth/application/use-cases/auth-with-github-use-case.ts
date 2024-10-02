import { Encoder } from '@auth-criptography/encoder'
import { Account } from '@auth-entities/account'
import { AuthUser } from '@auth-entities/auth-user'
import { AccountsRepository } from '@auth-repositories/accounts-repository'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { UserCreateProps } from '@core/entities/user'
import { MissingEmailError } from '@core/errors/errors/missing-email-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import z from 'zod'

interface AuthWithGithubUseCaseRequest {
  code: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  GITHUB_REDIRECT_URI: string
}

type AuthWithGithubUseCaseResponse = Either<
  ResourceNotFoundError | MissingEmailError,
  {
    token: string
  }
>

@Injectable()
export class AuthWithGithubUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly encoder: Encoder,
  ) {}

  async execute(
    props: AuthWithGithubUseCaseRequest,
  ): Promise<AuthWithGithubUseCaseResponse> {
    const data = await this.getAccessToken(props)

    const userInfoResponse = await this.getUserInfo(data.access_token)

    type UserInfo<T> = T extends MissingEmailError ? never : T

    let userInfo: UserInfo<typeof userInfoResponse>

    if (userInfoResponse instanceof MissingEmailError) {
      return left(new MissingEmailError(userInfoResponse.message))
    }

    // eslint-disable-next-line
    userInfo = userInfoResponse

    const { gitHubUserId, ...userProps } = userInfo

    const user = await this.getAuthUser(userProps)

    await this.handleAccount(gitHubUserId, user.id.value)

    const token = await this.encoder.encode({
      sub: user.id.value,
    })

    return right({ token })
  }

  private async getAccessToken({
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI,
    code,
  }: AuthWithGithubUseCaseRequest) {
    const oauthUrl = new URL('https://github.com/login/oauth/access_token')
    oauthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID)
    oauthUrl.searchParams.append('client_secret', GITHUB_CLIENT_SECRET)
    oauthUrl.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI)
    oauthUrl.searchParams.append('code', code)

    const response = await fetch(oauthUrl.toString(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    const dataSchema = z.object({
      access_token: z.string(),
      token_type: z.literal('bearer'),
      scope: z.string(),
    })

    const data = dataSchema.parse(json)

    return data
  }

  private async getUserInfo(accessToken: string) {
    const userInfoUrl = new URL('https://api.github.com/user')
    // userInfoUrl.searchParams.append('access_token', accessToken)

    const responseInfo = await fetch(userInfoUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const jsonInfo = await responseInfo.json()

    const userInfoSchema = z.object({
      id: z.number().int().transform(String),
      avatar_url: z.string().url().nullable(),
      email: z.string().email().nullable(),
      name: z.string().nullable(),
    })

    const userInfo = userInfoSchema.parse(jsonInfo)

    if (!userInfo.email) {
      return new MissingEmailError(
        `Your GitHub account must have an email to authenticate.`,
      )
    }

    const { email, name, avatar_url: avatarUrl, id: gitHubUserId } = userInfo

    return {
      email,
      name,
      avatarUrl,
      gitHubUserId,
    }
  }

  private async getAuthUser(props: UserCreateProps) {
    const userExists = await this.authUserRepository.findByEmail(props.email)

    let user: AuthUser

    if (!userExists) {
      const newUser = AuthUser.create(props)

      user = await this.authUserRepository.create(newUser)
    } else {
      user = userExists
      // update user
      user.name = props.name ?? null
      user.avatarUrl = props.avatarUrl ?? null
      user.email = props.email
      await this.authUserRepository.update(user)
    }

    return user
  }

  private async handleAccount(providerAccountId: string, userId: string) {
    const existingAccount =
      await this.accountsRepository.findByProviderAndUserId('GITHUB', userId)

    let account: Account

    if (!existingAccount) {
      const newAccount = Account.create({
        provider: 'GITHUB',
        providerAccountId,
        userId,
      })
      account = await this.accountsRepository.create(newAccount)
    } else {
      account = existingAccount
    }

    return account
  }
}
