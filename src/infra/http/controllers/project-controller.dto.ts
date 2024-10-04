import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '@pipes/zod-validation-pipe'
import z from 'zod'

// -------------- createProject --------------
const createProjectSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  slug: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})
export const createProjectPype = new ZodValidationPipe(createProjectSchema)
type CreateProjectProps = z.infer<typeof createProjectSchema>
export class CreateProjectPropsDto implements CreateProjectProps {
  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: CreateProjectProps['name']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url: CreateProjectProps['url']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  description: CreateProjectProps['description']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  slug: CreateProjectProps['slug']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  avatarUrl: CreateProjectProps['avatarUrl']
}

// -------------- updateProject --------------
const updateProjectSchema = z.object({
  name: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})
export const updateProjectPype = new ZodValidationPipe(updateProjectSchema)
type UpdateProjectProps = z.infer<typeof updateProjectSchema>
export class UpdateProjectPropsDto implements UpdateProjectProps {
  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: UpdateProjectProps['name']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  url: UpdateProjectProps['url']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  description: UpdateProjectProps['description']

  @ApiProperty({ type: String })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  avatarUrl: UpdateProjectProps['avatarUrl']
}
