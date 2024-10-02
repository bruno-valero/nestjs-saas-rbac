import { AuthMember } from '@auth-entities/auth-member'
import { AuthOrg } from '@auth-entities/auth-org'
import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'

interface AuthProfileProps {
  userId: string
  membership: { member: AuthMember; org: AuthOrg }[]
  name: string | null
  email: string
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date | null
}

interface AuthProfileCreationProps {
  userId: string
  membership: { member: AuthMember; org: AuthOrg }[]
  name?: string | null
  email: string
  avatarUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class AuthProfile extends Entity<AuthProfileProps> {
  static create(props: AuthProfileCreationProps, id?: string): AuthProfile {
    const authProfile = new AuthProfile(
      {
        ...props,
        name: props.name ?? null,
        avatarUrl: props.avatarUrl ?? null,
        updatedAt: props.updatedAt ?? null,
      },
      new UniqueEntityId(id),
    )
    return authProfile
  }

  get userId() {
    return this.props.userId
  }

  get membership() {
    return this.props.membership
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get avatarUrl() {
    return this.props.avatarUrl
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  toObject() {
    const object = {
      ...this.props,
      membership: this.membership.map((item) => ({
        member: item.member.toObject(),
        org: item.org.toObject(),
      })),
      id: this.id.value,
    }

    return object
  }

  toJSON() {
    const json = JSON.stringify(this.toObject())
    return json
  }
}
