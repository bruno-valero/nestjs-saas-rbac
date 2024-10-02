import { AuthService } from '@auth/auth.service'
import { BcryptEncrypter } from '@auth/cryptograpy/bcrypt-encrypter'
import { JwtEncoder } from '@auth/cryptograpy/jwt-encoder'
import { JwtStrategy } from '@auth/jwt.strategy'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { Encoder } from '@auth-criptography/encoder'
import { Encrypter } from '@auth-criptography/encrypter'
import { DatabaseModule } from '@database/database.module'
import { EnvModule } from '@env/env.module'
import { EnvService } from '@env/env.service'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const pathToPrivateKey = Buffer.from(
          env.get('JWT_PRIVATE_KEY'),
          'base64',
        )
        const pathToPublicKey = Buffer.from(env.get('JWT_PUBLIC_KEY'), 'base64')

        return {
          signOptions: { algorithm: 'RS256', expiresIn: '24h' },
          privateKey: pathToPrivateKey,
          publicKey: pathToPublicKey,
        }
      },
    }),
    PassportModule,
    EnvModule,
    DatabaseModule,
  ],
  providers: [
    JwtStrategy,
    { provide: Encrypter, useClass: BcryptEncrypter },
    { provide: Encoder, useClass: JwtEncoder },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AuthService,
  ],
  exports: [Encrypter, Encoder],
})
export class AuthModule {}
