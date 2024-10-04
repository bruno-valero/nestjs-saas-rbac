import { BaseUser } from '@orgs-entities/base-user'

export class BaseUserPresenter {
  static basic(user: BaseUser) {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
