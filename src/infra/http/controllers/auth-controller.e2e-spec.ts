import { AppModule } from '@infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('It should be able to create an account using email, name and password. | -> POST /auth/sign-in', async () => {
    const { email, password, name } = {
      email: 'bruno@valero.com.br',
      password: '12345678',
      name: 'Bruno Valero',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email, password, name })

    console.log('response.body', response.body)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        email: 'bruno@valero.com.br',
        name: 'Bruno Valero',
      }),
    )
  })
})
