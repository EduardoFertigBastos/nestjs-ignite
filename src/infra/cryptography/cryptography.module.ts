import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator';
import { HasherComparer } from '@/domain/forum/application/cryptography/hasher-comparer';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HasherGenerator, useClass: BcryptHasher },
    { provide: HasherComparer, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HasherGenerator, HasherComparer],
})
export class CryptographyModule {}
