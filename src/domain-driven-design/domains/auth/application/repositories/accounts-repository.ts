import { Account, AccountProvider } from '@auth-entities/account'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AccountsRepository {
  abstract findByProviderAndUserId(
    provider: AccountProvider,
    userId: string,
  ): Promise<Account | null>

  abstract findById(id: string): Promise<Account | null>
  abstract findManyByUserId(userId: string): Promise<Account[]>
  abstract create(account: Account): Promise<Account>
  abstract update(account: Account): Promise<Account>
  abstract delete(account: Account): Promise<void>
}
