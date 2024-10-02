import { CacheRepositoryData } from '@cache/cache-repository-data'
import { CacheRepository } from '@cache/cache-respository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisCacheRepositoryData implements CacheRepositoryData {
  constructor(private readonly cacheRepository: CacheRepository) {}

  async save<T, Mapped>(
    /** key where the data will be cached */
    key: string,
    options: {
      /** Callback executed to interact with the repository */
      callback: (...args: unknown[]) => Promise<T>
      /** Map the entity before caching */
      map: (arg: T) => Mapped
      /** UnMap the cached data returning the entity */
      unMap: (arg: Mapped) => T
    },
  ): Promise<T> {
    const { callback, map, unMap } = options

    const cachedData = await this.cacheRepository.get(key)

    if (cachedData) {
      const mapped = JSON.parse(cachedData) as Mapped

      const data = unMap(mapped)

      return data
    }

    const callbackResponse = await callback()

    const value = JSON.stringify(map(callbackResponse))

    this.cacheRepository.set(key, value)

    return callbackResponse
  }

  async refresh<T>(
    /** keys that will be removed from cache */
    keys: string[],
    /** Callback executed to interact with the repository */
    callback: (...args: unknown[]) => Promise<T>,
  ): Promise<T> {
    const callbackResponse = await callback()

    await Promise.all(
      keys.map(async (key) => {
        await this.cacheRepository.delete(key)
      }),
    )

    return callbackResponse
  }
}
