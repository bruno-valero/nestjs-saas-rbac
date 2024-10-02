import { AuthUser } from '@auth-entities/auth-user'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AuthUserRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>
  abstract findById(id: string): Promise<AuthUser | null>
  abstract create(props: AuthUser): Promise<AuthUser>
  abstract update(props: AuthUser): Promise<AuthUser>
  abstract delete(id: AuthUser): Promise<void>
}
