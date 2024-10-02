import { organizationSchema } from '@permissions/models/organization'
import { crudSchema } from '@permissions/subjects'
import { z } from 'zod'

export const organizationPermissionsSchema = z.enum(['transfer_ownership'])
export const organizationSubjectSchema = z.tuple([
  z.union([crudSchema, organizationPermissionsSchema]),
  z.union([z.literal('Organization'), organizationSchema]),
])
export type OrganizationSubject = [
  z.infer<typeof organizationSubjectSchema>[0],
  z.infer<typeof organizationSubjectSchema>[1],
]
