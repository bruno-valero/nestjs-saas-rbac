import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { type User } from '@permissions/models/user'
import { permissions } from '@permissions/permissions'
import { Subjects } from '@permissions/subjects'

type AppAbilities = Subjects

export type AppAbility = MongoAbility<AppAbilities>

export type ActionsTypes = Parameters<AppAbility['can']>[0]
export type SubjectsTypes = Parameters<AppAbility['can']>[1]

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  return builder.build({
    detectSubjectType(subject) {
      return subject.__typeName
    },
  })
}
