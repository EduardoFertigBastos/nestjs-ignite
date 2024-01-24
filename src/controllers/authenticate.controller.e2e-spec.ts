import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /sessions (200)', async () => {
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

    expect(responseSessions.status).toBe(201);
    expect(responseSessions.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
