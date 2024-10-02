import { Orgs } from '@orgs-entities/orgs'

export class OrgsPresenter {
  static basic(org: Orgs) {
    const {
      ownerId,
      name,
      url,
      domain,
      shouldAttachUsersByDomain,
      id,
      description,
      slug,
      avatarUrl,
      createdAt,
      updatedAt,
    } = org.toObject()

    return {
      id,
      name,
      url,
      description,
      slug,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
      createdAt,
      updatedAt,
      ownerId,
    }
  }
}
