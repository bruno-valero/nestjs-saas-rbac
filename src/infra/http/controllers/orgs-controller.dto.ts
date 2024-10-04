import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '@pipes/zod-validation-pipe'
import z from 'zod'

// -------------- createOrg --------------
const createOrgSchema = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string(),
  slug: z.string().optional(),
  domain: z.string(),
  shouldAttachUsersByDomain: z.boolean(),
  avatarUrl: z.string().nullable(),
})
export const createOrgPype = new ZodValidationPipe(createOrgSchema)
type CreateOrgProps = z.infer<typeof createOrgSchema>
export class CreateOrgPropsDto implements CreateOrgProps {
  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: CreateOrgProps['name']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url: CreateOrgProps['url']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  description: CreateOrgProps['description']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  slug: CreateOrgProps['slug']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  domain: CreateOrgProps['domain']

  @ApiProperty({ type: Boolean })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  shouldAttachUsersByDomain: CreateOrgProps['shouldAttachUsersByDomain']

  @ApiPropertyOptional({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  avatarUrl: CreateOrgProps['avatarUrl']
}

// -------------- updateOrganization --------------
const updateOrganizationSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
  shouldAttachUsersByDomain: z.boolean().optional(),
  avatarUrl: z.string().optional(),
})
export const updateOrganizationPype = new ZodValidationPipe(
  updateOrganizationSchema,
)
type UpdateOrganizationProps = z.infer<typeof updateOrganizationSchema>
export class UpdateOrganizationPropsDto implements UpdateOrganizationProps {
  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: UpdateOrganizationProps['name']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url: UpdateOrganizationProps['url']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  description: UpdateOrganizationProps['description']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  domain: UpdateOrganizationProps['domain']

  @ApiProperty({ type: Boolean })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  shouldAttachUsersByDomain: UpdateOrganizationProps['shouldAttachUsersByDomain']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  avatarUrl: UpdateOrganizationProps['avatarUrl']
}
