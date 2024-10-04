import Entity from '@core/entities/entity'

import { Role } from '@/permissions/permissions'
import {
  ActionsTypes,
  defineAbilityFor,
  SubjectsTypes,
} from '@/permissions/root'

interface UserProps {
  name: string | null
  email: string
  password: string | null
  avatarUrl: string | null
  role: Role[]
  createdAt: Date
  updatedAt: Date | null
}

export interface UserCreateProps {
  name?: string | null
  email: string
  password?: string | null
  avatarUrl?: string | null
  role?: Role[]
  createdAt?: Date
  updatedAt?: Date | null
}

export abstract class User extends Entity<UserProps> {
  //   abstract create(props: UserCreateProps, id?: string): User

  get name(): typeof this.props.name {
    return this.props.name
  }

  set name(name: typeof this.props.name) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: typeof this.props.email) {
    this.props.email = email
    this.touch()
  }

  get password(): typeof this.props.password {
    return this.props.password
  }

  set password(password: typeof this.props.password) {
    this.props.password = password
    this.touch()
  }

  get avatarUrl() {
    return this.props.avatarUrl
  }

  set avatarUrl(avatarUrl: typeof this.props.avatarUrl) {
    this.props.avatarUrl = avatarUrl
    this.touch()
  }

  get role() {
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
      const abiliy = defineAbilityFor({ role, id: this.id.value })

      return abiliy.can(action as 'create', subject)
    })

    const hasPermission = !permissions.some((permission) => !permission)

    return hasPermission
  }
}
