import { Injectable } from '@nestjs/common'
import { OrgInvite } from '@orgs-entities/org-invite'

@Injectable()
export abstract class OrgInvitesRepository {
  abstract findById(id: string): Promise<OrgInvite | null>
  abstract findManyByOrgId(orgId: string): Promise<OrgInvite[]>
  abstract findManyByEmail(email: string): Promise<OrgInvite[]>
  abstract create(props: OrgInvite): Promise<OrgInvite>
  abstract update(props: OrgInvite): Promise<OrgInvite>
}
