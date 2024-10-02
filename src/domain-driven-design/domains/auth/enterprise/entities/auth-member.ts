import Entity from '@core/entities/entity'
import { type Role } from '@permissions/permissions'

import UniqueEntityId from '@/domain-driven-design/core/entities/unique-entity-id'

interface AuthMemberProps {
  userId: UniqueEntityId
  organizationId: UniqueEntityId
  role: Role[]
}

export type AuthMemberCreationProps = {
  userId: string
  organizationId: string
  role: Role[]
}

export class AuthMember extends Entity<AuthMemberProps> {
  static create(props: AuthMemberCreationProps, id?: string): AuthMember {
    const authMember = new AuthMember(
      {
        ...props,
        organizationId: new UniqueEntityId(props.organizationId),
        userId: new UniqueEntityId(props.userId),
      },
      new UniqueEntityId(id),
    )
    return authMember
  }

  get userId(): UniqueEntityId {
    return this.props.userId
  }

  get organizationId(): UniqueEntityId {
    return this.props.organizationId
  }

  get role(): Role[] {
    return this.props.role
  }

  toObject() {
    return {
      id: this.id.value,
      userId: this.userId.value,
      organizationId: this.organizationId.value,
      role: this.role,
    }
  }
}
