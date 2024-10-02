import UniqueEntityId from '@core/entities/unique-entity-id'
import { Member, MemberCreationProps } from '@orgs-entities/member'

export class Admin extends Member {
  static create(props: MemberCreationProps, id?: string): Admin {
    const user = new Admin(
      {
        ...props,
        organizationId: new UniqueEntityId(props.organizationId),
        userId: new UniqueEntityId(props.userId),
        role: ['ADMIN'],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      new UniqueEntityId(id),
    )
    return user
  }
}
