import { TokenPayload } from '@auth/jwt.strategy'
import { Encoder } from '@auth-criptography/encoder'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncoder implements Encoder {
  constructor(private readonly jwtService: JwtService) {}

  async encode(value: TokenPayload): Promise<string> {
    return this.jwtService.sign(value)
  }

  async decode(value: string): Promise<TokenPayload> {
    return this.jwtService.verify<TokenPayload>(value)
  }
}
