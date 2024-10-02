import Entity from '@core/entities/entity'
import { type Role } from '@permissions/permissions'

import UniqueEntityId from '@/domain-driven-design/core/entities/unique-entity-id'
import {
  ActionsTypes,
  defineAbilityFor,
  SubjectsTypes,
} from '@/permissions/root'

interface MemberProps {
  userId: UniqueEntityId
  organizationId: UniqueEntityId
  role: Role[]
  createdAt: Date
  updatedAt: Date | null
}

export type MemberCreationProps = {
  userId: string
  organizationId: string
  role?: Role[]
  createdAt?: Date
  updatedAt?: Date | null
}

export class Member extends Entity<MemberProps> {
  static create(props: MemberCreationProps, id?: string): Member {
    const member = new Member(
      {
        ...props,
        organizationId: new UniqueEntityId(props.organizationId),
        userId: new UniqueEntityId(props.userId),
        role: props.role ?? ['MEMBER'],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      new UniqueEntityId(id),
    )
    return member
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  switchRole(role: Role[]) {
    const { role: currentRole } = { ...this.props }
    this.props.role = role
    this.touch()

    const removedRoles = currentRole.filter((role) => !role.includes(role))
    const addedRoles = this.props.role.filter((role) => !role.includes(role))

    return { removedRoles, addedRoles }
  }

  hasPermission(action: ActionsTypes, subject: SubjectsTypes) {
    const { role } = this.props

    const permissions = role.map((role) => {
      // eslint-disable-next-line
      // @ts-ignore
      const abiliy = defineAbilityFor({ role, id: this.userId.value })

      return abiliy.can(action as 'create', subject)
    })

    const hasPermission = !permissions.some((permission) => !permission)

    return hasPermission
  }

  toObject() {
    return {
      id: this.id.value,
      userId: this.userId.value,
      organizationId: this.organizationId.value,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  tojson() {
    const json = JSON.stringify(this.toObject())
    return json
  }
}
