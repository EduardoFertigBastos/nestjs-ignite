import { FakeHasher } from './../../../../../test/cryptography/fake-hasher';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'aa@gmail.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'aa@gmail.com',
      password: '12345678',
    });

    const hashedPassword = await fakeHasher.hash('12345678');

    expect(result.isRight()).toBe(true);
    expect(hashedPassword).toEqual(
      inMemoryStudentsRepository.items[0].password,
    );
  });
});
