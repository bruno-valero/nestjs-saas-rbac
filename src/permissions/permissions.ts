import { AbilityBuilder } from '@casl/ability'
import { User } from '@permissions/models/user'
import { ADMIN } from '@permissions/roles/admin'
import { BILLING } from '@permissions/roles/billing'
import { MEMBER } from '@permissions/roles/member'
import { AppAbility } from '@permissions/root'
import { z } from 'zod'

export const roleSchema = z.enum(['ADMIN', 'MEMBER', 'BILLING'])
export type Role = z.infer<typeof roleSchema>

export type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN,
  MEMBER,
  BILLING,
}
