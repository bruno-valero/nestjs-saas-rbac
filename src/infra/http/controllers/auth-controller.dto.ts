import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '@pipes/zod-validation-pipe'
import z from 'zod'

// -------------- signIn --------------
export const signInSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
})

export const signInPype = new ZodValidationPipe(signInSchema)
type SignInProps = z.infer<typeof signInSchema>
export class SignInPropsDto implements SignInProps {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: string

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: string

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  password: string
}

// -------------- signUp --------------
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const signUpPype = new ZodValidationPipe(signUpSchema)
type SignUpProps = z.infer<typeof signUpSchema>
export class SignUpPropsDto implements SignUpProps {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: string

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  password: string
}

// -------------- recoverPassword --------------
export const recoverPasswordSchema = z.object({
  email: z.string().email(),
})

export const recoverPasswordPype = new ZodValidationPipe(recoverPasswordSchema)
type RecoverPasswordProps = z.infer<typeof recoverPasswordSchema>
export class RecoverPasswordPropsDto implements RecoverPasswordProps {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: string
}

// -------------- resetPassword --------------
export const resetPasswordSchema = z.object({
  password: z.string().min(8),
  token: z.string(),
})

export const resetPasswordPype = new ZodValidationPipe(resetPasswordSchema)
type ResetPasswordProps = z.infer<typeof resetPasswordSchema>
export class ResetPasswordPropsDto implements ResetPasswordProps {
  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  password: string

  @ApiProperty()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  token: string
}
