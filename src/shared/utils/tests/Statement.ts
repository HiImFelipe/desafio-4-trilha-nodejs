import { OperationType, Statement } from "../../../modules/statements/entities/Statement";
import { ICreateStatementDTO } from "../../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../../../modules/statements/useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../../modules/statements/useCases/getStatementOperation/IGetStatementOperationDTO";

export const makeAValidStatement = (data?: Partial<Statement>): Required<Statement> => {
  const statement = new Statement();
  const defaultStatementData = {
    description: "any_description",
    amount: 1,
    type: OperationType.DEPOSIT,
    password: "any_password",
    user_id: "any_user_id",
  };

  Object.assign(statement, defaultStatementData);
  Object.assign(statement, data);

  return statement as Required<Statement>;
};

export const fakeStatementsRepository = {
  create: jest.fn<Promise<Statement>, [data: ICreateStatementDTO]>(),
  findStatementOperation: jest.fn<
    Promise<Statement | undefined>,
    [data: IGetStatementOperationDTO]
  >(),
  getUserBalance: jest.fn<
    Promise<{ balance: number } | { balance: number; statement: Statement[] }>,
    [data: IGetBalanceDTO]
  >(),
};
