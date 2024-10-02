import { Optional } from '@core/types/optional'
import { roleSchema } from '@permissions/permissions'
import { z } from 'zod'

export const userSchema = z.object({
  __typeName: z.literal('User').default('User'),
  id: z.string().optional(),
  email: z.string().optional(),
  role: roleSchema,
})
export type User = Optional<z.infer<typeof userSchema>, '__typeName'>
