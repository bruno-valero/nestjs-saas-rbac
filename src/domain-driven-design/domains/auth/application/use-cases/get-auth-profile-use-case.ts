import { AuthOrg } from '@auth-entities/auth-org'
import { AuthProfile } from '@auth-entities/auth-profile'
import { AuthMemberRepository } from '@auth-repositories/auth-member-repository'
import { AuthOrgsRepository } from '@auth-repositories/auth-orgs-repository'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetAuthProfileUseCaseRequest {
  userId: string
}

type GetAuthProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    authProfile: AuthProfile
  }
>

@Injectable()
export class GetAuthProfileUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly authMemberRepository: AuthMemberRepository,
    private readonly authOrgRepository: AuthOrgsRepository,
  ) {}

  async execute({
    userId,
  }: GetAuthProfileUseCaseRequest): Promise<GetAuthProfileUseCaseResponse> {
    const userExists = await this.authUserRepository.findById(userId)

    if (!userExists) return left(new ResourceNotFoundError())

    const membership = await this.authMemberRepository.findManyByUserId(userId)
    const orgs = (
      await Promise.all(
        membership.map(
          async (member) =>
            await this.authOrgRepository.findById(member.organizationId.value),
        ),
      )
    ).filter<AuthOrg>((org) => org !== null)

    const authProfile = AuthProfile.create({
      userId: userExists.id.value,
      membership: membership.map((item) => ({
        member: item,
        org: orgs.find((org) => org.id.equals(item.organizationId))!,
      })),
      name: userExists.name,
      email: userExists.email,
      avatarUrl: userExists.avatarUrl,
      createdAt: userExists.createdAt,
      updatedAt: userExists.updatedAt,
    })

    return right({ authProfile })
  }
}
