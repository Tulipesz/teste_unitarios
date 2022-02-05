import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository:InMemoryUsersRepository;
let createUserUseCase:CreateUserUseCase;
let inMemoryStatementsRepository:InMemoryStatementsRepository;
let createStatementUseCase:CreateStatementUseCase;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });
  it('should be able to make a deposit', async () => {
    const user: ICreateUserDTO = {
      email: 'test@email.com',
      name: 'Test Name',
      password: 'testpassword',
    };

    const { id } = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: id!,
      amount: 200,
      description: 'PIX de teste.',
      type: OperationType.DEPOSIT,
    };

    const result = await createStatementUseCase.execute(
      statement,
    );

    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('user_id');
  });

  it('should be able to make a withdraw', async () => {
    const user: ICreateUserDTO = {
      email: 'test@email.com',
      name: 'Test Name',
      password: 'testpassword',
    };

    const { id } = await createUserUseCase.execute(user);

    await createStatementUseCase.execute(
      {
        user_id: id!,
        amount: 200,
        description: 'Retirar fundos.',
        type: OperationType.DEPOSIT,
      },
    );

    const statement: ICreateStatementDTO = {
      user_id: id!,
      amount: 100,
      description: 'Retirar fundos.',
      type: OperationType.WITHDRAW,
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('user_id');
  });
});
