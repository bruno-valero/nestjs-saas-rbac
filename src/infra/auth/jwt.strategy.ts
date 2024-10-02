import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../env/env.service'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type TokenPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly env: EnvService) {
    // const publicKey = readFileSync('./keys/public_key.pem')
    const publicKey = Buffer.from(env.get('JWT_PUBLIC_KEY'), 'base64')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: FastifyRequest) => {
          let token: string | null = null
          // Extrai o JWT dos cookies (cookie chamado 'access_token')
          const cook = req.headers.cookie
          console.log('cook:', cook)
          if (req && req.cookies) {
            token = req.cookies.access_token ?? null
          }

          // Retorna o token extraído dos cookies ou do cabeçalho Bearer
          const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
          const resp = token || bearerToken

          return resp
        },
      ]),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenPayload) {
    return tokenSchema.parse(payload)
  }
}
