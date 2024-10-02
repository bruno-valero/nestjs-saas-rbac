import {
  exportsRepositories,
  injectRepositories,
} from '@database/@injects/@inject-repositories'
import { PrismaService } from '@database/prisma/prisma.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [PrismaService, ...injectRepositories],
  exports: [PrismaService, ...exportsRepositories],
})
export class DatabaseModule {}
