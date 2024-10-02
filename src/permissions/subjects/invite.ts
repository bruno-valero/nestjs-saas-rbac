import { crudSchema } from '@permissions/subjects'
import { z } from 'zod'

export const inviteSubjectSchema = z.tuple([crudSchema, z.literal('Invite')])
export type InviteSubject = [
  z.infer<typeof inviteSubjectSchema>[0],
  z.infer<typeof inviteSubjectSchema>[1],
]
