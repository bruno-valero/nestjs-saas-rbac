import { TokensRepository } from '@core/respositories/tokens-repositorie'
import { PrismaTokenMapper } from '@database/prisma/mappers/prisma-token-mapper'
import { PrismaService } from '@database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { Token } from '@/domain-driven-design/core/entities/token'

@Injectable()
export class PrismaTokensRepository implements TokensRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<Token | null> {
    const prismaToken = await this.prisma.token.findUnique({
      where: { id },
    })

    if (!prismaToken) return null

    const token = prismaToken

    const mappedToken = PrismaTokenMapper.toDomain({
      prismaToken: token,
    })

    return mappedToken
  }

  async findManyByUserId(userId: string): Promise<Token[]> {
    const prismaTokens = await this.prisma.token.findMany({
      where: { userId },
    })

    const tokens = prismaTokens

    const mappedTokens = tokens.map((token) =>
      PrismaTokenMapper.toDomain({
        prismaToken: token,
      }),
    )

    return mappedTokens
  }

  async create(props: Token): Promise<Token> {
    const prismaToken = await this.prisma.token.create({
      data: PrismaTokenMapper.domainToPrisma(props),
    })

    const mappedToken = PrismaTokenMapper.toDomain({
      prismaToken,
    })

    return mappedToken
  }

  async delete(id: Token): Promise<void> {
    await this.prisma.token.delete({
      where: { id: id.id.value },
    })
  }
}
