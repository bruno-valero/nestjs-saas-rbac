import { PrismaRoleMapper } from '@database/prisma/mappers/orgs/prisma-role-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { RoleItem } from '@orgs-entities/role-item'
import { RoleItemRepository } from '@orgs-repositories/role-item-repository'

@Injectable()
export class PrismaRoleItemRepository implements RoleItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<RoleItem | null> {
    const prismaRole = await this.prisma.role.findUnique({
      where: { id: Number(id) },
    })

    if (!prismaRole) return null

    const role = prismaRole

    const mappedRole = PrismaRoleMapper.toDomain({
      prismaRole: role,
    })

    return mappedRole
  }

  async findManyByMemberId(memberId: string): Promise<RoleItem[]> {
    const prismaRoles = await this.prisma.role.findMany({
      where: { memberId },
    })

    const roles = prismaRoles

    const mappedRoles = roles.map((role) =>
      PrismaRoleMapper.toDomain({
        prismaRole: role,
      }),
    )

    return mappedRoles
  }

  async create(props: RoleItem): Promise<RoleItem> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = PrismaRoleMapper.domainToPrisma(props)
    const prismaRole = await this.prisma.role.create({
      data,
    })

    const role = prismaRole

    const mappedRole = PrismaRoleMapper.toDomain({
      prismaRole: role,
    })

    return mappedRole
  }

  async createMany(roles: RoleItem[]): Promise<void> {
    const data = roles.map((role) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...roleData } = PrismaRoleMapper.domainToPrisma(role)
      return roleData
    })
    await this.prisma.role.createMany({
      data,
    })
  }

  async update(props: RoleItem): Promise<RoleItem> {
    const prismaRole = await this.prisma.role.update({
      where: { id: Number(props.id.value) },
      data: PrismaRoleMapper.domainToPrisma(props),
    })

    const role = prismaRole

    const mappedRole = PrismaRoleMapper.toDomain({
      prismaRole: role,
    })

    return mappedRole
  }

  async delete(id: RoleItem): Promise<void> {
    await this.prisma.role.delete({
      where: { id: Number(id.id.value) },
    })
  }

  async deleteMany(roles: RoleItem[]): Promise<void> {
    await this.prisma.role.deleteMany({
      where: {
        memberId: { in: roles.map((item) => item.memberId.value) },
        role: { in: roles.map((item) => item.role) },
      },
    })
  }
}
