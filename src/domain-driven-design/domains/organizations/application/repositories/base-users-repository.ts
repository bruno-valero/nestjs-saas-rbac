import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'

@Injectable()
export abstract class BaseUsersRepository {
  abstract findByEmail(email: string): Promise<BaseUser | null>
  abstract findById(id: string): Promise<BaseUser | null>
  abstract create(props: BaseUser): Promise<BaseUser>
  abstract update(props: BaseUser): Promise<BaseUser>
  abstract delete(id: BaseUser): Promise<void>
}
