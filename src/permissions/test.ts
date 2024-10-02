import { defineAbilityFor } from '@permissions/root'

const adm = defineAbilityFor({ role: 'ADMIN' })

console.log('ADMIN')
console.log('##################################################')
console.log('ADMIN can manage all:', adm.can('manage', 'all'))
console.log('ADMIN can create project:', adm.can('create', 'Project'))
console.log('ADMIN can invite:', adm.can('invite', 'User'))

console.log('\nMEMBER')
console.log('##################################################')

const member = defineAbilityFor({ role: 'MEMBER' })

console.log('MEMBER can manage project:', member.can('manage', 'Project'))
console.log('MEMBER can create project:', member.can('create', 'Project'))
console.log('MEMBER can invite:', member.can('invite', 'User'))
