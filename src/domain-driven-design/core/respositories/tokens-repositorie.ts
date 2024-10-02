import { Token } from '@core/entities/token'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class TokensRepository {
  abstract findById(id: string): Promise<Token | null>
  abstract findManyByUserId(userId: string): Promise<Token[]>
  abstract create(props: Token): Promise<Token>
  abstract delete(id: Token): Promise<void>
}
