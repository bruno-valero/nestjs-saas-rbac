import { Optional } from '@core/types/optional'
import { z } from 'zod'

export const organizationSchema = z.object({
  __typeName: z.literal('Organization').default('Organization'),
  id: z.string().optional(),
  ownerId: z.string().optional(),
})
export type Organization = Optional<
  z.infer<typeof organizationSchema>,
  '__typeName'
>
