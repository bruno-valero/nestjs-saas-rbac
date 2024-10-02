import { crudSchema } from '@permissions/subjects'
import { z } from 'zod'

export const billingPermissionsSchema = z.enum(['export'])
export const billingSubjectSchema = z.tuple([
  z.union([crudSchema, billingPermissionsSchema]),
  z.literal('Billing'),
])
export type BillingSubject = [
  z.infer<typeof billingSubjectSchema>[0],
  z.infer<typeof billingSubjectSchema>[1],
]
