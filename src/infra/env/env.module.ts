import { EnvService } from '@env/env.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
