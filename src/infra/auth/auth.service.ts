import { PrismaService } from '@database/prisma/prisma.service'
import { EnvService } from '@env/env.service'
import {
  Injectable,
  // UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import { User } from '@prisma/client'
// import { Auth, google } from 'googleapis'

@Injectable()
export class AuthService {
  //   private oauthClient: Auth.OAuth2Client
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
  ) {
    // const clientId = env.get('GOOGLE_CLIENT_ID')
    // const clientSecret = env.get('GOOGLE_CLIENT_SECRET')
    // this.oauthClient = new google.auth.OAuth2(clientId, clientSecret)
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // // implement your logic here
    //
    console.log('email:', email)
    console.log('password:', password)
    return { access_token: '' }
    //
    // const user = await this.prisma.user.findUnique({ where: { email } })
    // if (user?.password !== password) {
    //   throw new UnauthorizedException()
    // }
    // const payload = { sub: user.id }
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    // }
  }

  //   async signInWithGoogle({
  //     token,
  //     name,
  //   }: {
  //     token: string
  //     name: string
  //   }): Promise<{ access_token: string }> {
  //     const tokenInfo = await this.oauthClient.getTokenInfo(token)

  //     if (!tokenInfo.email) {
  //       throw new UnauthorizedException()
  //     }

  //     let user: User

  //     user = await this.prisma.user.findUnique({
  //       where: { email: tokenInfo.email },
  //     })

  //     if (!user) {
  //       user = await this.prisma.user.create({
  //         data: {
  //           email: tokenInfo.email,
  //           name,
  //         },
  //       })
  //     }
  //     const payload = { sub: user.id }
  //     return {
  //       access_token: await this.jwtService.signAsync(payload),
  //     }
  //   }
}
