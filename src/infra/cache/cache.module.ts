import { CacheRepositoryData } from '@cache/cache-repository-data'
import { CacheRepository } from '@cache/cache-respository'
import { RedisService } from '@cache/redis/redis.service'
import { RedisCacheRepository } from '@cache/redis/redis-cache-repository'
import { RedisCacheRepositoryData } from '@cache/redis/redis-cache-repository-data'
import { EnvModule } from '@env/env.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    { provide: CacheRepositoryData, useClass: RedisCacheRepositoryData },
    { provide: CacheRepository, useClass: RedisCacheRepository },
  ],
  exports: [CacheRepository, CacheRepositoryData],
})
export class CacheModule {}
