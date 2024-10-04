import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  const config = new DocumentBuilder()
    .setTitle('Saas RBAC Nest.js')
    .setDescription(
      'Boilerplate for a multitenant SaaS application with Nodejs, Nextjs and Postgres.',
    )
    .setContact(
      'brunovalero',
      'https://brunovalero.com.br',
      'brunofvn6@gmail.com',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT Authorization header using the Bearer scheme',
        in: 'header',
      },
      'AUTH_ROUTE',
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(port, '0.0.0.0', () =>
    console.log(`listenning on port ${port}`),
  )
}
bootstrap()
