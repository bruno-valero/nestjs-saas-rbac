import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class CacheRepositoryData {
  abstract save<T, Mapped>(
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
  ): Promise<T>

  abstract refresh<T>(
    keys: string[],
    callback: (...args: unknown[]) => Promise<T>,
  ): Promise<T>
}
