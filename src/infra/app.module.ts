import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { envSchema } from './env/env';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { EnvService } from './env/env.service';
import { EnvModule } from './env/env.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    EventsModule,
    CryptographyModule,
    HttpModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
