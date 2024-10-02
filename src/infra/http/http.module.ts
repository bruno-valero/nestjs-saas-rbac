import { AuthModule } from '@auth/auth.module'
import { CacheModule } from '@cache/cache.module'
import { AuthController } from '@controllers/auth.controller'
import { HelloWorldController } from '@controllers/hello-world.controller'
import { OrgsController } from '@controllers/orgs.controller'
import { ProjectController } from '@controllers/project.controller'
import { DatabaseModule } from '@database/database.module'
import { injectUseCases } from '@http/@injects/@inject-use-cases'
import { Module } from '@nestjs/common'

import { MemberController } from './controllers/member.controller'

@Module({
  imports: [DatabaseModule, AuthModule, CacheModule],
  controllers: [
    HelloWorldController,
    AuthController,
    OrgsController,
    ProjectController,
    MemberController,
  ],
  providers: [...injectUseCases],
})
export class HttpModule {}
