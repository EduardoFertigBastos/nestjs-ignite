import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';

describe('Create Account (e2e)', () => {
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

  test('[POST] /create-account (201)', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@gmail.com' },
    });

    expect(userOnDatabase).toBeTruthy();

    const responseRepeatedEmail = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      });

    expect(responseRepeatedEmail.status).toBe(409);
  });
});