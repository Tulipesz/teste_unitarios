import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase:GetBalanceUseCase;
let inMemoryStatementsRepository:InMemoryStatementsRepository;
let inMemoryUsersRepository:InMemoryUsersRepository;
let createUserUseCase:CreateUserUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get balance', async () => {
    const user: ICreateUserDTO = { email: 'test@email.com', name: 'Test', password: 'testpassword' };

    const { id } = await createUserUseCase.execute(user);

    const result = await getBalanceUseCase.execute({ user_id: id! });

    expect(result).toHaveProperty('balance');
    expect(result).toHaveProperty('statement');
  });
});
