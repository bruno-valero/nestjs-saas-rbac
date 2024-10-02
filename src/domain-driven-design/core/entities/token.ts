import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'

type TokenType = 'PASSWORD_RECOVER'

interface TokenProps {
  type: TokenType
  userId: string
  createdAt: Date
}

export class Token extends Entity<TokenProps> {
  static create(props: TokenProps, id?: string) {
    const token = new Token(props, new UniqueEntityId(id))
    return token
  }

  get type() {
    return this.props.type
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
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
