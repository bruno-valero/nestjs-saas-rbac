import { RoleItem } from '@orgs-entities/role-item'
import { Role } from '@prisma/client'

export class PrismaRoleMapper {
  static toDomain({ prismaRole }: { prismaRole: Role }): RoleItem {
    const role = RoleItem.create(
      {
        memberId: prismaRole.memberId,
        role: prismaRole.role,
      },
      String(prismaRole.id),
    )

    return role
  }

  static domainToPrisma(role: RoleItem): Role {
    const prismaRole = <Role>{
      memberId: role.memberId.value,
      role: role.role,
      id: Number(role.id.value),
    }

    return prismaRole
  }
}
