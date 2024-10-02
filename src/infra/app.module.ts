import { envSchema } from '@env/env'
import { EnvModule } from '@env/env.module'
import { HttpModule } from '@http/http.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
  ],
  providers: [],
})
export class AppModule {}
