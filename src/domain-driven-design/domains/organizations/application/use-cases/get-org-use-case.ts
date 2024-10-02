import { Either, left, right } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'

interface GetOrgUseCaseRequest {
  orgSlug: string
}

type GetOrgUseCaseResponse = Either<ResourceNotFoundError, { org: Orgs }>

@Injectable()
export class GetOrgUseCase {
  constructor(private readonly orgRepository: OrgsRepository) {}
  async execute(props: GetOrgUseCaseRequest): Promise<GetOrgUseCaseResponse> {
    const org = await this.orgRepository.findBySlug(props.orgSlug)

    if (!org) {
      return left(new ResourceNotFoundError())
    }
    return right({ org })
  }
}
