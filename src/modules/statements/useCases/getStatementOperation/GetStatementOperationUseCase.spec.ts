import {
  fakeStatementsRepository,
  makeAValidStatement,
} from "../../../../shared/utils/tests/Statement";
import {
  fakeUsersRepository,
  makeAValidUser,
} from "../../../../shared/utils/tests/User";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

const sut = new GetStatementOperationUseCase(
  fakeUsersRepository,
  fakeStatementsRepository
);

describe("Get statement operation", () => {
  it("should get a statement's operation", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement();

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.findStatementOperation.mockResolvedValue(
      statement
    );

    const response = await sut.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(response).toEqual(statement);
  });

  it("should not get a statement operation (user not found)", async () => {
    fakeUsersRepository.findById.mockResolvedValue(undefined);

    const promise = sut.execute({
      user_id: "invalid_user_id",
      statement_id: "any_statement_id",
    });

    await expect(promise).rejects.toBeInstanceOf(
      GetStatementOperationError.UserNotFound
    );
  });

  it("should not get a statement operation (statement not found)", async () => {
    const user = makeAValidUser();

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.findStatementOperation.mockResolvedValue(
      undefined
    );

    const promise = sut.execute({
      user_id: user.id,
      statement_id: "any_statement_id",
    });

    await expect(promise).rejects.toBeInstanceOf(
      GetStatementOperationError.StatementNotFound
    );
  });
});
