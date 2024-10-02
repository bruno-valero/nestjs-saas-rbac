import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { DomainEvents } from '@core/events/domain-events'
import { envSchema } from '@env/env'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

const prisma = new PrismaClient()

const DATABASE_URL = env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL not found')
const schema = randomUUID()

beforeAll(async () => {
  const url = new URL(DATABASE_URL)
  url.searchParams.set('schema', schema)
  process.env.DATABASE_URL = url.toString()
  DomainEvents.shouldRun = false
  execSync('npx prisma migrate deploy')
  await redis.flushdb()
})

afterAll(async () => {
  await prisma.$queryRawUnsafe(`
    DROP SCHEMA IF EXISTS "${schema}" CASCADE
  `)
  await prisma.$disconnect()
})
