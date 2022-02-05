import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository:InMemoryUsersRepository;
let inMemoryStatementsRepository:InMemoryStatementsRepository;
let createUserUseCase:CreateUserUseCase;
let getStatementOperationUseCase:GetStatementOperationUseCase;
let createStatementUseCase:CreateStatementUseCase;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to get statement operation', async () => {
    const user:ICreateUserDTO = {
      email: 'test@email.com',
      name: 'Test Name',
      password: 'testpassword',
    };

    const { id: user_id } = await createUserUseCase.execute(user);

    const statement:ICreateStatementDTO = {
      amount: 500,
      description: 'PIX de teste.',
      user_id: user_id!,
      type: OperationType.DEPOSIT,
    };

    const { id: statement_id } = await createStatementUseCase.execute(statement);

    const result = await getStatementOperationUseCase.execute({
      user_id: user_id!,
      statement_id: statement_id!,
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('user_id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
  });
});
