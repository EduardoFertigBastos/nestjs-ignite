import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { RegisterStudentUseCase } from './../../../domain/forum/application/use-cases/register-student';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';

const createAccountBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6).max(32),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body;

    const result = await this.registerStudent.execute({
      email,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === StudentAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw new BadRequestException(error.message);
    }

    const { student } = result.value;

    return {
      student: {
        ...student,
        password: undefined,
      },
    };
  }
}
