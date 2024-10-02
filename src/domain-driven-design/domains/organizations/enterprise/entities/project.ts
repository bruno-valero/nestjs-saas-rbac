import Entity from '@core/entities/entity'
import UniqueEntityId from '@core/entities/unique-entity-id'
import { Slug } from '@orgs-value-objects/slug'

interface ProjectProps {
  organizationId: UniqueEntityId
  ownerId: UniqueEntityId
  name: string
  url: string
  description: string
  slug: Slug
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date | null
}
type ProjectCreationProps = {
  organizationId: string
  ownerId: string
  name: string
  url: string
  description: string
  slug?: string
  avatarUrl?: string | null
  createdAt?: Date
  updatedAt?: Date | null
}

export class Project extends Entity<ProjectProps> {
  static create(props: ProjectCreationProps, id?: string): Project {
    const project = new Project(
      {
        ...props,
        organizationId: new UniqueEntityId(props.organizationId),
        ownerId: new UniqueEntityId(props.ownerId),
        slug: props.slug ? new Slug(props.slug) : new Slug(props.name),
        avatarUrl: props.avatarUrl ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      new UniqueEntityId(id),
    )
    return project
  }

  get organizationId(): UniqueEntityId {
    return this.props.organizationId
  }

  get ownerId(): UniqueEntityId {
    return this.props.ownerId
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get url(): string {
    return this.props.url
  }

  set url(url: string) {
    this.props.url = url
    this.touch()
  }

  get description(): string {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  set slug(slug: string) {
    this.props.slug = new Slug(slug)
    this.touch()
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl
  }

  set avatarUrl(avatarUrl: string | null) {
    this.props.avatarUrl = avatarUrl
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  toObject() {
    return {
      id: this.id.value,
      organizationId: this.organizationId.value,
      ownerId: this.ownerId.value,
      name: this.name,
      url: this.url,
      description: this.description,
      slug: this.slug.toString(),
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  tojson() {
    const json = JSON.stringify(this.toObject())
    return json
  }
}
