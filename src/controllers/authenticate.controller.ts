import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

// const createAccountBodySchema = z.object({
//   email: z.string().email(),
//   name: z.string(),
//   password: z.string().min(6).max(32),
// });

// type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle() {
    const token = this.jwt.sign({ sub: '123' });

    return token;
  }
}
