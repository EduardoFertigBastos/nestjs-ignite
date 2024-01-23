import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    const question = await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });

    return {
      question,
    };
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u836f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
