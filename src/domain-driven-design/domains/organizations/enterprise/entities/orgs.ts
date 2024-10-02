import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'
import { Slug } from '@orgs-value-objects/slug'

interface OrgsProps {
  ownerId: string
  name: string
  url: string
  description: string
  slug: Slug
  domain: string | null
  shouldAttachUsersByDomain: boolean
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date | null
}

type OrgsCreationProps = {
  ownerId: string
  name: string
  url: string
  description: string
  slug?: string
  domain?: string
  shouldAttachUsersByDomain: boolean
  avatarUrl?: string | null
  createdAt?: Date
  updatedAt?: Date | null
}

export class Orgs extends Entity<OrgsProps> {
  static create(props: OrgsCreationProps, id?: string): Orgs {
    const orgs = new Orgs(
      {
        ...props,

        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        avatarUrl: props.avatarUrl ?? null,
        slug: props.slug ? new Slug(props.slug) : new Slug(props.name),
        domain: props.domain ?? null,
      },
      new UniqueEntityId(id),
    )
    return orgs
  }

  get ownerId() {
    return this.props.ownerId
  }

  set ownerId(ownerId: typeof this.props.ownerId) {
    this.props.ownerId = ownerId
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: typeof this.props.name) {
    this.props.name = name
    this.touch()
  }

  get url() {
    return this.props.url
  }

  set url(url: typeof this.props.url) {
    this.props.url = url
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: typeof this.props.description) {
    this.props.description = description
    this.touch()
  }

  get slug(): typeof this.props.slug {
    return this.props.slug
  }

  set slug(slug: string) {
    this.props.slug = new Slug(slug)
    this.touch()
  }

  get domain() {
    return this.props.domain
  }

  set domain(domain: typeof this.props.domain) {
    this.props.domain = domain
    this.touch()
  }

  get shouldAttachUsersByDomain() {
    return this.props.shouldAttachUsersByDomain
  }

  set shouldAttachUsersByDomain(
    shouldAttachUsersByDomain: typeof this.props.shouldAttachUsersByDomain,
  ) {
    this.props.shouldAttachUsersByDomain = shouldAttachUsersByDomain
    this.touch()
  }

  get avatarUrl() {
    return this.props.avatarUrl
  }

  set avatarUrl(avatarUrl: typeof this.props.avatarUrl) {
    this.props.avatarUrl = avatarUrl
    this.touch()
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

  toObject() {
    const object = {
      ...this.props,
      slug: this.slug.toString(),
      id: this.id.value,
    }

    return object
  }

  toJSON() {
    const json = JSON.stringify(this.toObject())
    return json
  }
}
