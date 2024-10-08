import { AccountsRepository } from '@auth-repositories/accounts-repository'
import { AuthMemberRepository } from '@auth-repositories/auth-member-repository'
import { AuthOrgsRepository } from '@auth-repositories/auth-orgs-repository'
import { AuthUserRepository } from '@auth-repositories/auth-user-repository'
import { TokensRepository } from '@core/respositories/tokens-repositorie'
import { PrismaAccountsRepository } from '@database/prisma/repositories/auth/prisma-accounts-repository'
import { PrismaAuthMemberRepository } from '@database/prisma/repositories/auth/prisma-auth-member-repository'
import { PrismaAuthOrgsRepository } from '@database/prisma/repositories/auth/prisma-auth-orgs-repositories'
import { PrismaAuthUserRepository } from '@database/prisma/repositories/auth/prisma-auth-user-repository'
import { PrismaBaseUsersRepository } from '@database/prisma/repositories/orgs/prisma-base-users-repository'
import { PrismaMembersRepository } from '@database/prisma/repositories/orgs/prisma-members-repository'
import { PrismaOrgInvitesRepository } from '@database/prisma/repositories/orgs/prisma-org-invites-repository'
import { PrismaOrgsRepository } from '@database/prisma/repositories/orgs/prisma-orgs-repository'
import { PrismaProjectsRepository } from '@database/prisma/repositories/orgs/prisma-projects-repository'
import { PrismaRoleItemRepository } from '@database/prisma/repositories/orgs/prisma-role-item-repository'
import { PrismaTokensRepository } from '@database/prisma/repositories/prisma-tokens-repository'
import { ModuleMetadata, Provider } from '@nestjs/common'
import { BaseUsersRepository } from '@orgs-repositories/base-users-repository'
import { MembersRepository } from '@orgs-repositories/members-repository'
import { OrgInvitesRepository } from '@orgs-repositories/org-invites-repository'
import { OrgsRepository } from '@orgs-repositories/orgs-repository'
import { ProjectsRepository } from '@orgs-repositories/projects-repository'
import { RoleItemRepository } from '@orgs-repositories/role-item-repository'

const coreRepositories: Provider[] = [
  // core
  { provide: TokensRepository, useClass: PrismaTokensRepository },
]

const authRepositories: Provider[] = [
  // auth
  { provide: AuthUserRepository, useClass: PrismaAuthUserRepository },
  { provide: AuthMemberRepository, useClass: PrismaAuthMemberRepository },
  { provide: AuthOrgsRepository, useClass: PrismaAuthOrgsRepository },
  { provide: AccountsRepository, useClass: PrismaAccountsRepository },
]

const orgsRepositories: Provider[] = [
  { provide: BaseUsersRepository, useClass: PrismaBaseUsersRepository },
  { provide: OrgsRepository, useClass: PrismaOrgsRepository },
  { provide: MembersRepository, useClass: PrismaMembersRepository },
  { provide: ProjectsRepository, useClass: PrismaProjectsRepository },
  { provide: RoleItemRepository, useClass: PrismaRoleItemRepository },
  { provide: OrgInvitesRepository, useClass: PrismaOrgInvitesRepository },
]

export const injectRepositories: Provider[] = [
  ...coreRepositories,
  ...authRepositories,
  ...orgsRepositories,
]

export const exportsRepositories: NonNullable<ModuleMetadata['exports']> = [
  //   core
  TokensRepository,
  // auth
  AuthUserRepository,
  AuthMemberRepository,
  AuthOrgsRepository,
  AccountsRepository,
  //   orgs
  BaseUsersRepository,
  OrgsRepository,
  MembersRepository,
  ProjectsRepository,
  RoleItemRepository,
  OrgInvitesRepository,
]
