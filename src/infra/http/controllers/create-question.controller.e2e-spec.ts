import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/infra/app.module';
import request from 'supertest';

describe('Create Question (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /questions (201)', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
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
