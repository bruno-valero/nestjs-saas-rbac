import { Optional } from '@core/types/optional'
import { z } from 'zod'

export const projectSchema = z.object({
  __typeName: z.literal('Project').default('Project'),
  id: z.string().optional(),
  ownerId: z.string().optional(),
})
export type Project = Optional<z.infer<typeof projectSchema>, '__typeName'>
