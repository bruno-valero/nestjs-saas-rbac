import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  const publicKey = envService.get('JWT_PUBLIC_KEY')

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: ['*'],
  })

  await app.register(fastifyCookie, {
    secret: publicKey, // for cookies signature
    algorithm: 'RSA-SHA256',
    hook: 'onRequest',
  })

  await app.listen(port, '0.0.0.0', () =>
    console.log(`listenning on port ${port}`),
  )
}
bootstrap()
