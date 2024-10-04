import { Role } from '@permissions/permissions'

import Entity from '@/domain-driven-design/core/entities/entity'
import UniqueEntityId from '@/domain-driven-design/core/entities/unique-entity-id'

interface RoleItemProps {
  memberId: UniqueEntityId
  role: Role
}

type RoleItemCreationProps = {
  memberId: string
  role: Role
}

export class RoleItem extends Entity<RoleItemProps> {
  static create(props: RoleItemCreationProps, id?: string): RoleItem {
    const roleItem = new RoleItem(
      {
        ...props,
        memberId: new UniqueEntityId(props.memberId),
      },
      new UniqueEntityId(id),
    )
    return roleItem
  }

  get memberId(): UniqueEntityId {
    return this.props.memberId
  }

  get role(): Role {
    return this.props.role
  }

  toObject() {
    return {
      id: this.id.value,
      memberId: this.memberId.value,
      role: this.role,
    }
  }

  toJSON(ident?: number) {
    const json = JSON.stringify(this.toObject(), null, ident)
    return json
  }
}
