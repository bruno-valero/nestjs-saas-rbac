import { CacheRepository } from '@cache/cache-respository'
import { RedisService } from '@cache/redis/redis.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private readonly redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    const twelveHours = 60 * 60 * 12
    await this.redis.set(key, value, 'EX', twelveHours)
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
