import { AuthUser } from '@auth-entities/auth-user'

export class AuthUserPresenter {
  static basic(authUser: AuthUser) {
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
    }
  }
}
