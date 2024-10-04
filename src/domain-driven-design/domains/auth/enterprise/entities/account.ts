import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'

export type AccountProvider = 'GITHUB'

interface AccountProps {
  provider: AccountProvider
  providerAccountId: string
  userId: string
}

export class Account extends Entity<AccountProps> {
  static create(props: AccountProps, id?: string): Account {
    const account = new Account(
      {
        ...props,
      },
      new UniqueEntityId(id),
    )
    return account
  }

  get provider() {
    return this.props.provider
  }

  get providerAccountId() {
    return this.props.providerAccountId
  }

  get userId() {
    return this.props.userId
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
