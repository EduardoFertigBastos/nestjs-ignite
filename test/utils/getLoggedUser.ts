import { INestApplication } from '@nestjs/common';
import request from 'supertest';

interface Props {
  token: string;
  user: any;
}

export async function getLoggedUser(app: INestApplication): Promise<Props> {
  const { body: bodyRegisterUser } = await request(app.getHttpServer())
    .post('/accounts')
    .send({
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

  return { token, user: bodyRegisterUser.student };
}
