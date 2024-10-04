import { OrgInvite } from '@orgs-entities/org-invite'

export class InvitePresenter {
  static basic(invite: OrgInvite) {
    return {
      id: invite.id.value,
      email: invite.email,
      role: invite.role,
      createdAt: invite.createdAt,
    }
  }
}
