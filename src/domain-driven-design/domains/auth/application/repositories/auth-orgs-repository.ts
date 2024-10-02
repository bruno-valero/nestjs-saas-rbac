import { AuthOrg, AuthOrgProps } from '@auth-entities/auth-org'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AuthOrgsRepository {
  abstract findByDomain(
    domain: string,
    and?: Partial<AuthOrgProps>,
  ): Promise<AuthOrg | null>

  abstract findById(id: string): Promise<AuthOrg | null>
  abstract findManyByUserId(userId: string): Promise<AuthOrg[]>
}
