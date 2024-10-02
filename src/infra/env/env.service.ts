import { EnvSchema } from '@env/env'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvSchema, true>) {}

  get<T extends keyof EnvSchema>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
