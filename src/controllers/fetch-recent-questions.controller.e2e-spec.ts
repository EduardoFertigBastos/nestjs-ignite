import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('Fetch Recent Questions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[GET] /questions (200)', async () => {
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

    await Promise.all([
      request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'What a title 1',
          content: 'What a content',
        }),

      request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'What a title 2',
          content: 'What a content',
        }),

      request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'What a title 3',
          content: 'What a content',
        }),
    ]);

    const responseQuestions = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(responseQuestions.status).toBe(200);
    expect(responseQuestions.body.questions.length).toBe(3);
    expect(responseQuestions.body.questions).toEqual([
      expect.objectContaining({ title: 'What a title 3' }),
      expect.objectContaining({ title: 'What a title 2' }),
      expect.objectContaining({ title: 'What a title 1' }),
    ]);
  });
});
