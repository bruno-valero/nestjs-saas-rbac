import { Encrypter } from '@auth-criptography/encrypter'
import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

@Injectable()
export class BcryptEncrypter implements Encrypter {
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 8)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
