import { ApiProperty } from '@nestjs/swagger'
import { roleSchema } from '@permissions/permissions'
import { ZodValidationPipe } from '@pipes/zod-validation-pipe'
import z from 'zod'

// -------------- createInvite --------------
const createInviteSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
})
export const createInvitePype = new ZodValidationPipe(createInviteSchema)
type CreateInviteProps = z.infer<typeof createInviteSchema>
export class CreateInvitePropsDto implements CreateInviteProps {
  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: CreateInviteProps['email']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  role: CreateInviteProps['role']
}
