import { Injectable } from '@nestjs/common'
import { RoleItem } from '@orgs-entities/role-item'

@Injectable()
export abstract class RoleItemRepository {
  abstract findById(id: string): Promise<RoleItem | null>
  abstract findManyByMemberId(memberId: string): Promise<RoleItem[]>
  abstract create(props: RoleItem): Promise<RoleItem>
  abstract createMany(roles: RoleItem[]): Promise<void>
  abstract update(props: RoleItem): Promise<RoleItem>
  abstract delete(id: RoleItem): Promise<void>
  abstract deleteMany(roles: RoleItem[]): Promise<void>
}
