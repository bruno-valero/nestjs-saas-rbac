import { crudSchema } from '@permissions/subjects'
import { z } from 'zod'

export const userPermissionsSchema = z.enum(['invite'])
export const userSubjectSchema = z.tuple([
  z.union([crudSchema, userPermissionsSchema]),
  z.literal('User'),
])
export type UserSubject = [
  z.infer<typeof userSubjectSchema>[0],
  z.infer<typeof userSubjectSchema>[1],
]
