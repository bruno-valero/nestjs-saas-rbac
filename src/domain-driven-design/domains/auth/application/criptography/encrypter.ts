import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class Encrypter {
  abstract hash(value: string): Promise<string>
  abstract compare(value: string, hash: string): Promise<boolean>
}
