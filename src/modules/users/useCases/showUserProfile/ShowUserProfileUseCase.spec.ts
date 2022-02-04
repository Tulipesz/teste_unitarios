import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let createUserUseCase:CreateUserUseCase;
let authenticateUserUseCase:AuthenticateUserUseCase;
let inMemoryUsersRepository:InMemoryUsersRepository;
let showUserProfileUseCase:ShowUserProfileUseCase;

describe('Show Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });
  it('should be able to show profile', async () => {
    const user: ICreateUserDTO = {
      name: 'Test name',
      email: 'test@email.com',
      password: 'testpassword',
    };

    await createUserUseCase.execute(user);

    const { user: { id } } = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const result = await showUserProfileUseCase.execute(id!);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('name');
  });
});
