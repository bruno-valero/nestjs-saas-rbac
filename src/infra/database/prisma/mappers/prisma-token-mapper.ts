import { Token } from '@core/entities/token'
import { Token as PrismaToken } from '@prisma/client'

export class PrismaTokenMapper {
  static toDomain({ prismaToken }: { prismaToken: PrismaToken }): Token {
    const token = Token.create(
      {
        type: prismaToken.type,
        userId: prismaToken.userId,
        createdAt: prismaToken.createdAt,
      },
      prismaToken.id,
    )

    return token
  }

  static domainToPrisma(token: Token): PrismaToken {
    const { type, userId, createdAt } = token.toObject()
    const prismaToken = <PrismaToken>{
      type,
      userId,
      createdAt,
    }

    return prismaToken
  }
}
