import { TokenPayload } from '@auth/jwt.strategy'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class Encoder {
  abstract encode(value: TokenPayload): Promise<string>
  abstract decode(value: string): Promise<TokenPayload>
}
