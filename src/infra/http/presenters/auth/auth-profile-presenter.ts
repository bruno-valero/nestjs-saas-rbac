import { AuthProfile } from '@auth-entities/auth-profile'

export class AuthProfilePresenter {
  static basic(authProfile: AuthProfile) {
    const { userId, membership, name, email, avatarUrl, createdAt, updatedAt } =
      authProfile.toObject()

    return {
      userId,
      membership,
      name,
      email,
      avatarUrl,
      createdAt,
      updatedAt,
    }
  }
}
