import { Injectable } from '@nestjs/common'
import { Member } from '@orgs-entities/member'
import { Role } from '@permissions/permissions'

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
  abstract countByUserEmail(email: string): Promise<number>
  abstract findManyByOrgId(orgId: string): Promise<Member[]>
  abstract countByOrgIdExcludingRoles(
    orgId: string,
    roles: Role[],
  ): Promise<number>

  abstract findManyByUserId(userId: string): Promise<Member[]>
  abstract create(props: Member): Promise<Member>
  abstract update(props: Member): Promise<Member>
  abstract delete(id: Member): Promise<void>
}
