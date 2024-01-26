import { FetchRecentQuestionsUseCase } from './../../../domain/forum/application/use-cases/fetch-recent-questions';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { QuestionPresenter } from '../presenters/question-presenter';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const questions = result.value.questions.map((question) =>
      QuestionPresenter.toHTTP(question),
    );

    return {
      questions,
    };
  }
}
