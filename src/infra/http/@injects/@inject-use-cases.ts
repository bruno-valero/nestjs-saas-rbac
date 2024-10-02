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
import { DeleteMemberUseCase } from '@orgs-use-cases/members/delete-member-use-case'
import { FetchMembersUseCase } from '@orgs-use-cases/members/fetch-members-use-case'
import { UpdateMemberUseCase } from '@orgs-use-cases/members/update-member-use-case'
import { CreateProjectUseCase } from '@orgs-use-cases/project/create-project-use-case'
import { DeleteProjectUseCase } from '@orgs-use-cases/project/delete-project-use-case'
import { FetchProjectsUseCase } from '@orgs-use-cases/project/fetch-projects-use-case'
import { GetProjectDetailsUseCase } from '@orgs-use-cases/project/get-project-details-use-case'
import { UpdateProjectUseCase } from '@orgs-use-cases/project/update-project-use-case'
import { ShutdownOrgUseCase } from '@orgs-use-cases/shutdown-org-use-case'
import { TransferOrgOwnershipUseCase } from '@orgs-use-cases/transfer-org-ownership-use-case'
import { UpdateOrgUseCase } from '@orgs-use-cases/update-org-use-case'

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
  UpdateOrgUseCase,
  ShutdownOrgUseCase,
  TransferOrgOwnershipUseCase,
]

const projectUseCases: Provider[] = [
  // project
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectDetailsUseCase,
  FetchProjectsUseCase,
  UpdateProjectUseCase,
  DeleteMemberUseCase,
]

const membersUseCases: Provider[] = [
  // members
  FetchMembersUseCase,
  UpdateMemberUseCase,
]

export const injectUseCases: Provider[] = [
  ...coreUseCases,
  ...authUseCases,
  ...orgsUseCases,
  ...projectUseCases,
  ...membersUseCases,
]
