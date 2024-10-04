import { AuthModule } from '@auth/auth.module'
import { CacheModule } from '@cache/cache.module'
import { AuthController } from '@controllers/auth.controller'
// import { HelloWorldController } from '@controllers/hello-world.controller'
import { InviteController } from '@controllers/invite.controller'
import { MemberController } from '@controllers/member.controller'
import { OrgsController } from '@controllers/orgs.controller'
import { ProjectController } from '@controllers/project.controller'
import { DatabaseModule } from '@database/database.module'
import { injectUseCases } from '@http/@injects/@inject-use-cases'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule, AuthModule, CacheModule],
  controllers: [
    // HelloWorldController,
    AuthController,
    OrgsController,
    ProjectController,
    MemberController,
    InviteController,
  ],
  providers: [...injectUseCases],
})
export class HttpModule {}
