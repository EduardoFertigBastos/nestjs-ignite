import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import e from 'express';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';

describe('Create Question (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /questions (201)', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const responseSessions = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'johndoe@gmail.com',
        password: '123456',
      });

    const token = responseSessions.body.access_token;

    const responseQuestions = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'What a title',
        content: 'What a content',
      });

    expect(responseQuestions.status).toBe(201);
    expect(responseQuestions.body.question).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'What a title',
        content: 'What a content',
      }),
    );
  });
});
