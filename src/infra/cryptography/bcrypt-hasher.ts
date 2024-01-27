import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';

import { HasherComparer } from '@/domain/forum/application/cryptography/hasher-comparer';
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator';

export class BcryptHasher implements HasherGenerator, HasherComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return await bcryptHash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcryptCompare(plain, hash);
  }
}
