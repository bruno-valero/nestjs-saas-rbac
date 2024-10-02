import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'

export interface AuthOrgProps {
  ownerId: string
  name: string
  url: string
  domain: string
  shouldAttachUsersByDomain: boolean
}

export class AuthOrg extends Entity<AuthOrgProps> {
  static create(props: AuthOrgProps, id?: string): AuthOrg {
    const authOrg = new AuthOrg(props, new UniqueEntityId(id))
    return authOrg
  }

  get ownerId() {
    return this.props.ownerId
  }

  get name() {
    return this.props.name
  }

  get url() {
    return this.props.url
  }

  get domain() {
    return this.props.domain
  }

  get shouldAttachUsersByDomain() {
    return this.props.shouldAttachUsersByDomain
  }

  toObject() {
    const object = {
      ...this.props,
      id: this.id.value,
    }

    return object
  }

  toJSON(indent?: number) {
    const json = JSON.stringify(this.toObject(), null, indent)
    return json
  }
}
