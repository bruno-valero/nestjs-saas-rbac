import { projectSchema } from '@permissions/models/project'
import { crudSchema } from '@permissions/subjects'
import { z } from 'zod'

export const projectSubjectSchema = z.tuple([
  crudSchema,
  z.union([z.literal('Project'), projectSchema]),
])
export type ProjectSubject = [
  z.infer<typeof projectSubjectSchema>[0],
  z.infer<typeof projectSubjectSchema>[1],
]
