import { PartialBoolean, PickEntityKeys } from '@core/types/entity-utils'
import { Injectable } from '@nestjs/common'
import { BaseUser } from '@orgs-entities/base-user'
import { OrgInvite } from '@orgs-entities/org-invite'

@Injectable()
export abstract class OrgInvitesRepository {
  abstract findById(id: string): Promise<OrgInvite | null>
  abstract findManyByOrgId(orgId: string): Promise<OrgInvite[]>
  abstract findManyByOrgIdChoosingFields<
    Fields extends PartialBoolean<OrgInvite> & {
      author?: PartialBoolean<BaseUser>
    },
  >(
    orgId: string,
    fields: Fields,
  ): Promise<PickEntityKeys<Fields, OrgInvite & { author?: BaseUser }>[]>

  abstract findManyByEmail(email: string): Promise<OrgInvite[]>
  abstract countByEmail(email: string): Promise<number>
  abstract create(props: OrgInvite): Promise<OrgInvite>
  abstract update(props: OrgInvite): Promise<OrgInvite>
  abstract delete(props: OrgInvite): Promise<void>
}
