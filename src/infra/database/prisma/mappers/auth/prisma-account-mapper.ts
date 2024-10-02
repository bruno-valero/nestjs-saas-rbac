import { Account } from '@auth-entities/account'
import { Account as PrismAccount } from '@prisma/client'

export class PrismaAccountMapper {
  static toDomain(prismaAccount: PrismAccount): Account {
    const account = Account.create(
      {
        provider: prismaAccount.provider,
        providerAccountId: prismaAccount.providerAccountId,
        userId: prismaAccount.userId,
      },
      prismaAccount.id,
    )
    return account
  }

  static domainToPrisma(account: Account): PrismAccount {
    const { provider, providerAccountId, userId } = account.toObject()
    const prismaAccount = <PrismAccount>{
      provider,
      providerAccountId,
      userId,
    }
    return prismaAccount
  }
}
