import { Injectable } from '@nestjs/common'
import { Orgs } from '@orgs-entities/orgs'

@Injectable()
export abstract class OrgsRepository {
  abstract findById(id: string): Promise<Orgs | null>
  abstract findByDomain(domain: string): Promise<Orgs | null>
  abstract findBySlug(slug: string): Promise<Orgs | null>
  abstract findManyByUserId(userId: string): Promise<Orgs[]>
  abstract create(props: Orgs): Promise<Orgs>
  abstract update(props: Orgs): Promise<Orgs>
  abstract delete(id: Orgs): Promise<void>
}
