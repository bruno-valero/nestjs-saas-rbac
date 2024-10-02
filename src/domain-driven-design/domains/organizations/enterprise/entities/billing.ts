// import { Member, MemberCreationProps } from '@orgs-entities/member'

// import UniqueEntityId from '@/domain-driven-design/core/entities/unique-entity-id'

// export class Billing extends Member {
//   static create(props: MemberCreationProps, id?: string): Billing {
//     const user = new Billing(
//       {
//         ...props,
//         organizationId: new UniqueEntityId(props.organizationId),
//         userId: new UniqueEntityId(props.userId),
//         role: ['BILLING'],

//         createdAt: props.createdAt ?? new Date(),
//         updatedAt: props.updatedAt ?? null,
//       },
//       new UniqueEntityId(id),
//     )
//     return user
//   }
// }
