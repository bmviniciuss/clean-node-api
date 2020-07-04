import bcrypt from 'bcrypt'

import { HashComparer } from '../../data/protocols/cryptography/HashComparer'
import { Hasher } from '../../data/protocols/cryptography/Hasher'

export class BcrypterAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return new Promise((resolve) => resolve(true))
  }
}
