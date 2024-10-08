import { PermissionsByRole } from '@permissions/permissions'

export const ADMIN: PermissionsByRole = (user, { can, cannot }) => {
  can('manage', 'all')

  // ------- Organization ---------
  cannot(['transfer_ownership', 'update', 'delete'], 'Organization')
  can(['transfer_ownership', 'update', 'delete'], 'Organization', {
    ownerId: { $eq: user.id },
  })

  can('read', 'User')
}
