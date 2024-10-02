import { crudSchema } from '@permissions/subjects'
import { billingPermissionsSchema } from '@permissions/subjects/billing'
import { organizationPermissionsSchema } from '@permissions/subjects/organization'
import { userPermissionsSchema } from '@permissions/subjects/user'
import { z } from 'zod'

export const allSubjectSchema = z.tuple([
  z.union([
    crudSchema,
    userPermissionsSchema,
    organizationPermissionsSchema,
    billingPermissionsSchema,
  ]),
  z.literal('all'),
])
export type AllSubjects = [
  z.infer<typeof allSubjectSchema>[0],
  z.infer<typeof allSubjectSchema>[1],
]
