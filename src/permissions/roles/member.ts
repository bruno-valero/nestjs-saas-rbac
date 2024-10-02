import { PermissionsByRole } from '@permissions/permissions'

export const MEMBER: PermissionsByRole = (user, builder) => {
  // ------- User ---------
  builder.can(['read'], 'User')

  // ------- Project ---------
  builder.can(['create', 'read'], 'Project')
  builder.can(['delete', 'update'], 'Project', { ownerId: { $eq: user.id } })
}
