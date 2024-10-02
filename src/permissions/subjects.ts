import { AllSubjects } from '@permissions/subjects/all'
import { BillingSubject } from '@permissions/subjects/billing'
import { InviteSubject } from '@permissions/subjects/invite'
import { OrganizationSubject } from '@permissions/subjects/organization'
import { ProjectSubject } from '@permissions/subjects/project'
import { UserSubject } from '@permissions/subjects/user'
import { z } from 'zod'

export const crudSchema = z.enum([
  'create',
  'read',
  'update',
  'delete',
  'manage',
])

export type Subjects =
  | ProjectSubject
  | UserSubject
  | OrganizationSubject
  | InviteSubject
  | BillingSubject
  | AllSubjects
