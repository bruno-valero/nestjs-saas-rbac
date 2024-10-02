import { AuthMember } from '@auth-entities/auth-member'
import { Member as PrismaMember, Role } from '@prisma/client'

export class PrismaAuthMemberMapper {
  static toDomain(
    prismaMember: PrismaMember & { roles: { role: Role['role'] }[] },
  ): AuthMember {
    const member = AuthMember.create(
      {
        userId: prismaMember.userId,
        organizationId: prismaMember.organizationId,
        role: prismaMember.roles.map((role) => role.role),
      },
      prismaMember.id,
    )

    return member
  }

  static domainToPrisma(member: AuthMember): PrismaMember {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...rest } = member.toObject()
    const prismaMember = <PrismaMember>{
      ...rest,
    }

    return prismaMember
  }
}
