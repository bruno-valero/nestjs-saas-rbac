import { ApiProperty } from '@nestjs/swagger'
import { roleSchema } from '@permissions/permissions'
import z from 'zod'

import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'

// -------------- updateMember --------------
const updateMemberSchema = z.object({
  role: z.array(roleSchema),
})
export const updateMemberPype = new ZodValidationPipe(updateMemberSchema)
type UpdateMemberProps = z.infer<typeof updateMemberSchema>
export class UpdateMemberPropsDto implements UpdateMemberProps {
  @ApiProperty({ type: Array<string> })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  role: UpdateMemberProps['role']
}
