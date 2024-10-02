import { AuthWithGithubUseCase } from '@auth-use-cases/auth-with-github-use-case'
import { AuthWithPasswordUseCase } from '@auth-use-cases/auth-with-password-use-case'
import { CreateAccountUseCase } from '@auth-use-cases/create-account-use-case'
import { GetAuthProfileUseCase } from '@auth-use-cases/get-auth-profile-use-case'
import { RecoverPasswordRequestUseCase } from '@auth-use-cases/recover-password-request-use-case'
import { ResetPasswordUseCase } from '@auth-use-cases/reset-password-use-case'
import { Provider } from '@nestjs/common'
import { CreateOrgUseCase } from '@orgs-use-cases/create-org-use-case'
import { FetchOrgsUseCase } from '@orgs-use-cases/fetch-orgs-use-case'
import { GetMembershipUseCase } from '@orgs-use-cases/get-membership-use-case'
import { GetOrgUseCase } from '@orgs-use-cases/get-org-use-case'
import { UpdateOrganizationUseCase } from '@orgs-use-cases/update-organization-use-case'

const coreUseCases: Provider[] = [
  // core
  RecoverPasswordRequestUseCase,
]

const authUseCases: Provider[] = [
  // auth
  CreateAccountUseCase,
  AuthWithPasswordUseCase,
  GetAuthProfileUseCase,
  ResetPasswordUseCase,
  AuthWithGithubUseCase,
]

const orgsUseCases: Provider[] = [
  // orgs
  CreateOrgUseCase,
  GetMembershipUseCase,
  GetOrgUseCase,
  FetchOrgsUseCase,
  UpdateOrganizationUseCase,
]

export const injectUseCases: Provider[] = [
  ...coreUseCases,
  ...authUseCases,
  ...orgsUseCases,
]
