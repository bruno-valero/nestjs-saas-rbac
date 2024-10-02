import { PermissionsByRole } from '@permissions/permissions'

export const BILLING: PermissionsByRole = (user, builder) => {
  builder.can('manage', 'Billing')
}
