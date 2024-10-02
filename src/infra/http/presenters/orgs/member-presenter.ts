import { Member } from '@orgs-entities/member'

export class MemberPresenter {
  static basic(member: Member) {
    const { userId, organizationId, role, createdAt, updatedAt, id } =
      member.toObject()

    return {
      id,
      userId,
      organizationId,
      role,
      createdAt,
      updatedAt,
    }
  }
}
