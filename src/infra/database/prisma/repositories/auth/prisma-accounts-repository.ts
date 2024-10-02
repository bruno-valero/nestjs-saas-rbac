import { Account, AccountProvider } from '@auth-entities/account'
import { AccountsRepository } from '@auth-repositories/accounts-repository'
import { PrismaAccountMapper } from '@database/prisma/mappers/auth/prisma-account-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderAndUserId(
    provider: AccountProvider,
    userId: string,
  ): Promise<Account | null> {
    const prismaAccount = await this.prisma.account.findUnique({
      where: { provider_userId: { userId, provider } },
    })

    if (!prismaAccount) return null

    const mapped = PrismaAccountMapper.toDomain(prismaAccount)

    return mapped
  }

  async findById(id: string): Promise<Account | null> {
    const prismaAccount = await this.prisma.account.findUnique({
      where: { id },
    })

    if (!prismaAccount) return null

    const mapped = PrismaAccountMapper.toDomain(prismaAccount)
    return mapped
  }

  async findManyByUserId(userId: string): Promise<Account[]> {
    const prismaAccount = await this.prisma.account.findMany({
      where: { userId },
    })

    const mapped = prismaAccount.map(PrismaAccountMapper.toDomain)
    return mapped
  }

  async create(account: Account): Promise<Account> {
    const prismaAccount = await this.prisma.account.create({
      data: PrismaAccountMapper.domainToPrisma(account),
    })

    const mapped = PrismaAccountMapper.toDomain(prismaAccount)
    return mapped
  }

  async update(account: Account): Promise<Account> {
    const prismaAccount = await this.prisma.account.update({
      where: { id: account.id.value },
      data: {
        ...PrismaAccountMapper.domainToPrisma(account),
      },
    })

    const mapped = PrismaAccountMapper.toDomain(prismaAccount)
    return mapped
  }

  async delete(account: Account): Promise<void> {
    await this.prisma.account.delete({
      where: { id: account.id.value },
    })
  }
}
