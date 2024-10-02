import { AuthModule } from '@auth/auth.module'
import { CacheModule } from '@cache/cache.module'
import { AuthController } from '@controllers/auth.controller'
import { HelloWorldController } from '@controllers/hello-world.controller'
import { OrgsController } from '@controllers/orgs.controller'
import { DatabaseModule } from '@database/database.module'
import { injectUseCases } from '@http/@injects/@inject-use-cases'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule, AuthModule, CacheModule],
  controllers: [HelloWorldController, AuthController, OrgsController],
  providers: [...injectUseCases],
})
export class HttpModule {}
