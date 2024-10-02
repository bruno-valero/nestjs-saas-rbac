import Entity from '@core/entities/entity'
import { Role } from '@permissions/permissions'

import UniqueEntityId from '@/domain-driven-design/core/entities/unique-entity-id'

interface OrgInviteProps {
  authorId: UniqueEntityId | null
  organizationId: UniqueEntityId
  email: string
  role: Role
  createdAt: Date
}

type OrgInviteCreationProps = {
  authorId?: string | null
  organizationId: string
  email: string
  role: Role
  createdAt?: Date
}

export class OrgInvite extends Entity<OrgInviteProps> {
  static create(props: OrgInviteCreationProps, id?: string): OrgInvite {
    const orgInvite = new OrgInvite(
      {
        ...props,
        authorId: props.authorId ? new UniqueEntityId(props.authorId) : null,
        organizationId: new UniqueEntityId(props.organizationId),
        email: props.email,
        role: props.role,
        createdAt: props.createdAt ?? new Date(),
      },
      new UniqueEntityId(id),
    )
    return orgInvite
  }

  get authorId(): UniqueEntityId | null {
    return this.props.authorId
  }

  get organizationId(): UniqueEntityId {
    return this.props.organizationId
  }

  get email(): string {
    return this.props.email
  }

  get role(): Role {
    return this.props.role
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  toObject() {
    return {
      id: this.id.value,
      authorId: this.authorId?.value,
      organizationId: this.organizationId.value,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    }
  }

  tojson() {
    const json = JSON.stringify(this.toObject())
    return json
  }
}
