import bcrypt from 'bcrypt'

import { Encrypter } from '../../data/protocols/Encrypter'

export class BcrypterAdapter implements Encrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return null
  }
}
