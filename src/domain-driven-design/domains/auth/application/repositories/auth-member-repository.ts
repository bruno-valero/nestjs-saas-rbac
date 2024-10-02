import { AuthMember } from '@auth-entities/auth-member'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AuthMemberRepository {
  abstract findById(id: string): Promise<AuthMember | null>
  abstract findByOrgAndUserId(
    orgId: string,
    userId: string,
  ): Promise<AuthMember | null>

  abstract findManyByUserId(userId: string): Promise<AuthMember[]>
  abstract create(props: AuthMember): Promise<AuthMember>
  abstract update(props: AuthMember): Promise<AuthMember>
  abstract delete(id: AuthMember): Promise<void>
}
