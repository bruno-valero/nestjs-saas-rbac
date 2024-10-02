import { Member } from '@orgs-entities/member'
import { Member as PrismaMember, Role } from '@prisma/client'

export class PrismaMemberMapper {
  static toDomain(
    prismaMember: PrismaMember & { roles: { role: Role['role'] }[] },
  ): Member {
    const member = Member.create(
      {
        userId: prismaMember.userId,
        organizationId: prismaMember.organizationId,
        role: prismaMember.roles.map((role) => role.role),
        createdAt: prismaMember.createdAt,
        updatedAt: prismaMember.updatedAt,
      },
      prismaMember.id,
    )
    return member
  }

  static domainToPrisma(member: Member): PrismaMember {
    const { role, ...rest } = member.toObject() // eslint-disable-line

    const prismaMember = <PrismaMember>{
      ...rest,
    }

    return prismaMember
  }
}
