import UniqueEntityId from '@core/entities/unique-entity-id'
import { User, UserCreateProps } from '@core/entities/user'

export class BaseUser extends User {
  static create(props: UserCreateProps, id?: string): BaseUser {
    const user = new BaseUser(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        role: [],
        password: props.password ?? null,
        name: props.name ?? null,
        avatarUrl: props.avatarUrl ?? null,
      },
      new UniqueEntityId(id),
    )
    return user
  }

  toObject() {
    const object = {
      ...this.props,
      id: this.id.value,
    }

    return object
  }

  toJSON(ident?: number) {
    const json = JSON.stringify(this.toObject(), null, ident)
    return json
  }
}
