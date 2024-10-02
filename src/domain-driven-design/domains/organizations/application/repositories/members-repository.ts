import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'

@Injectable()
export abstract class MembersRepository {
  abstract findById(id: string): Promise<Member | null>
  abstract findByOrgAndUserId(
    orgId: string,
    userId: string,
  ): Promise<Member | null>

  abstract findByOrgAndUserEmail(
    orgId: string,
    email: string,
  ): Promise<Member | null>

  abstract findManyByUserEmail(email: string): Promise<Member[]>

  abstract findManyByOrgId(orgId: string): Promise<Member[]>
  abstract findManyByUserId(userId: string): Promise<Member[]>
  abstract create(props: Member): Promise<Member>
  abstract update(props: Member): Promise<Member>
  abstract delete(id: Member): Promise<void>
}
